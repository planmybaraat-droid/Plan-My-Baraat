import { crmSupabase } from '../lib/supabase-crm';

export const ASSET_CATEGORIES = ['Truck','DJ Truck','Car','Vintage Car','Other'] as const;
export const ASSET_STATUSES = ['Available','Under Maintenance','Inactive'] as const;
export const MAINTENANCE_TYPES = ['Regular Service','Repair','Emergency Repair','Parts Replacement','Other'] as const;
export const DOCUMENT_TYPES = ['RC Book','Insurance','PUC','Fitness Certificate','Permit','Other'] as const;

export type AssetCategory = typeof ASSET_CATEGORIES[number];
export type AssetStatus = typeof ASSET_STATUSES[number];
export type Asset = {
  id:string; asset_name:string; category:AssetCategory; registration_number:string; brand:string|null; model:string|null;
  manufacturing_year:number|null; color:string|null; purchase_date:string|null; purchase_cost:number|null;
  odometer_reading:number|null; status:AssetStatus; created_by:string; created_at:string; updated_at:string;
};
export type AssetInput = Omit<Asset,'id'|'created_by'|'created_at'|'updated_at'>;
export type Maintenance = {
  id:string; asset_id:string; maintenance_date:string; maintenance_type:string; description:string; items_changed:string|null;
  total_cost:number; next_maintenance_date:string|null; bill_path:string|null; bill_name:string|null; notes:string|null;
  created_by:string; created_at:string; creator_name?:string;
};
export type AssetDocument = {
  id:string; asset_id:string; document_type:string; document_number:string|null; issue_date:string|null; expiry_date:string|null;
  file_path:string; file_name:string; notes:string|null; created_by:string; created_at:string; creator_name?:string;
};

function cleanNullable(value: unknown) { const next=String(value??'').trim(); return next || null; }
export function assetPayload(input: AssetInput) {
  return {
    asset_name: input.asset_name.trim(), category: input.category, registration_number: input.registration_number.trim().toUpperCase(),
    brand: cleanNullable(input.brand), model: cleanNullable(input.model), manufacturing_year: input.manufacturing_year || null,
    color: cleanNullable(input.color), purchase_date: input.purchase_date || null, purchase_cost: input.purchase_cost ?? null,
    odometer_reading: input.odometer_reading ?? null, status: input.status,
  };
}

export async function loadAssetDashboard(){
  const [{data:assets,error:ae},{data:documents,error:de},{data:maintenance,error:me}] = await Promise.all([
    crmSupabase.from('crm_assets').select('*').order('asset_name'),
    crmSupabase.from('crm_asset_documents').select('asset_id,expiry_date'),
    crmSupabase.from('crm_asset_maintenance').select('asset_id,next_maintenance_date').not('next_maintenance_date','is',null),
  ]);
  if(ae||de||me) throw new Error(ae?.message||de?.message||me?.message||'Unable to load assets.');
  return { assets:(assets??[]) as Asset[], documents:(documents??[]) as Pick<AssetDocument,'asset_id'|'expiry_date'>[], maintenance:(maintenance??[]) as Pick<Maintenance,'asset_id'|'next_maintenance_date'>[] };
}

export async function loadAssetDetails(assetId:string){
  const [{data:maintenance,error:me},{data:documents,error:de}] = await Promise.all([
    crmSupabase.from('crm_asset_maintenance').select('*').eq('asset_id',assetId).order('maintenance_date',{ascending:false}).order('created_at',{ascending:false}),
    crmSupabase.from('crm_asset_documents').select('*').eq('asset_id',assetId).order('created_at',{ascending:false}),
  ]);
  if(me||de) throw new Error(me?.message||de?.message||'Unable to load asset details.');
  const rows=[...(maintenance??[]),...(documents??[])] as Array<{created_by:string}>;
  const ids=Array.from(new Set(rows.map(row=>row.created_by).filter(Boolean)));
  const names:Record<string,string>={};
  if(ids.length){ const {data,error}=await crmSupabase.from('crm_users').select('id,full_name').in('id',ids); if(!error) for(const row of data??[]) names[row.id]=row.full_name; }
  return {
    maintenance:(maintenance??[]).map(row=>({...row,creator_name:names[row.created_by]||'CRM user'})) as Maintenance[],
    documents:(documents??[]).map(row=>({...row,creator_name:names[row.created_by]||'CRM user'})) as AssetDocument[],
  };
}

export async function createAsset(input:AssetInput){
  const {data:{user}}=await crmSupabase.auth.getUser(); if(!user) throw new Error('Your session has expired. Please sign in again.');
  const {data,error}=await crmSupabase.from('crm_assets').insert({...assetPayload(input),created_by:user.id}).select().single();
  if(error) throw new Error(error.code==='23505'?'An asset with this registration number already exists.':error.message);
  return data as Asset;
}
export async function updateAsset(id:string,input:AssetInput){
  const {data,error}=await crmSupabase.from('crm_assets').update({...assetPayload(input),updated_at:new Date().toISOString()}).eq('id',id).select().single();
  if(error) throw new Error(error.code==='23505'?'An asset with this registration number already exists.':error.message);
  return data as Asset;
}

const ALLOWED_TYPES=['application/pdf','image/jpeg','image/png','image/webp'];
function validateFile(file:File){ if(file.size>10*1024*1024) throw new Error('File must be 10 MB or smaller.'); if(!ALLOWED_TYPES.includes(file.type)) throw new Error('Upload a PDF, JPG, PNG or WebP file.'); }
function safeName(name:string){ return name.replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-').slice(-100); }
async function upload(assetId:string,folder:string,file:File,requestKey:string){ validateFile(file); const path=`${assetId}/${folder}/${requestKey}-${safeName(file.name)}`; const {error}=await crmSupabase.storage.from('asset-files').upload(path,file,{contentType:file.type,upsert:false}); if(error) throw new Error(error.message); return path; }
async function cleanup(path:string|null){ if(path) await crmSupabase.storage.from('asset-files').remove([path]).catch(()=>undefined); }

export async function addMaintenance(assetId:string,values:{maintenance_date:string;maintenance_type:string;description:string;items_changed:string;total_cost:number;next_maintenance_date:string;notes:string},file:File|null,requestKey:string){
  const {data:{user}}=await crmSupabase.auth.getUser(); if(!user) throw new Error('Your session has expired. Please sign in again.');
  let billPath:string|null=null;
  try{
    if(file) billPath=await upload(assetId,'maintenance',file,requestKey);
    const {data,error}=await crmSupabase.from('crm_asset_maintenance').insert({request_key:requestKey,asset_id:assetId,maintenance_date:values.maintenance_date,maintenance_type:values.maintenance_type,description:values.description.trim(),items_changed:cleanNullable(values.items_changed),total_cost:values.total_cost,next_maintenance_date:values.next_maintenance_date||null,bill_path:billPath,bill_name:file?.name||null,notes:cleanNullable(values.notes),created_by:user.id}).select().single();
    if(error) throw error; return data as Maintenance;
  }catch(cause){ await cleanup(billPath); const error=cause as {code?:string;message?:string}; throw new Error(error.code==='23505'?'This maintenance entry was already saved.':error.message||'Unable to add maintenance.'); }
}

export async function addDocument(assetId:string,values:{document_type:string;document_number:string;issue_date:string;expiry_date:string;notes:string},file:File,requestKey:string){
  const {data:{user}}=await crmSupabase.auth.getUser(); if(!user) throw new Error('Your session has expired. Please sign in again.');
  let filePath:string|null=null;
  try{
    filePath=await upload(assetId,'documents',file,requestKey);
    const {data,error}=await crmSupabase.from('crm_asset_documents').insert({request_key:requestKey,asset_id:assetId,document_type:values.document_type,document_number:cleanNullable(values.document_number),issue_date:values.issue_date||null,expiry_date:values.expiry_date||null,file_path:filePath,file_name:file.name,notes:cleanNullable(values.notes),created_by:user.id}).select().single();
    if(error) throw error; return data as AssetDocument;
  }catch(cause){ await cleanup(filePath); const error=cause as {code?:string;message?:string}; throw new Error(error.code==='23505'?'This document was already saved.':error.message||'Unable to upload document.'); }
}

export async function openAssetFile(path:string){ const {data,error}=await crmSupabase.storage.from('asset-files').createSignedUrl(path,300); if(error||!data?.signedUrl) throw new Error(error?.message||'Unable to open file.'); window.open(data.signedUrl,'_blank','noopener,noreferrer'); }
export async function downloadAssetFile(path:string,fileName:string){
  const {data,error}=await crmSupabase.storage.from('asset-files').createSignedUrl(path,300,{download:fileName});
  if(error||!data?.signedUrl) throw new Error(error?.message||'Unable to download file.');
  const link=document.createElement('a');link.href=data.signedUrl;link.download=fileName;document.body.appendChild(link);link.click();link.remove();
}

export function documentState(expiry:string|null){ if(!expiry)return {label:'No Expiry',className:'bg-gray-100 text-gray-600'}; const today=new Date();today.setHours(0,0,0,0);const date=new Date(`${expiry}T00:00:00`);const days=Math.ceil((date.getTime()-today.getTime())/86400000);if(days<0)return{label:'Expired',className:'bg-red-50 text-red-700'};if(days<=30)return{label:'Expiring Soon',className:'bg-amber-50 text-amber-700'};return{label:'Valid',className:'bg-emerald-50 text-emerald-700'}; }
export function maintenanceState(date:string|null){ if(!date)return null;const today=new Date();today.setHours(0,0,0,0);const due=new Date(`${date}T00:00:00`);const days=Math.ceil((due.getTime()-today.getTime())/86400000);if(days<0)return{label:`Overdue by ${Math.abs(days)} day${Math.abs(days)===1?'':'s'}`,className:'bg-red-50 text-red-700 border-red-200'};if(days===0)return{label:'Due today',className:'bg-amber-50 text-amber-800 border-amber-200'};if(days<=7)return{label:`Due in ${days} day${days===1?'':'s'}`,className:'bg-blue-50 text-blue-700 border-blue-200'};return null; }
