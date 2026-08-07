import { createBrowserClient } from '@supabase/ssr';
import type {
  City, Category, VendorPackage,
  Vendor, VendorFormData, VendorFilters, VendorStats,
  CustomerLead, LeadFormData, LeadFilters, LeadStats,
  BaraatEnquiry, BaraatEnquiryFilters,
  Note, UploadedFile, AgreementRecord, AgreementFormData, AgreementFilters, AgreementActivity,
  VendorAgreementRecord, VendorAgreementFormData, VendorAgreementFilters, VendorAgreementActivity
} from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Cookie-backed browser client (not localStorage-only) so the session is
// visible to middleware/server code for real route protection, while the
// query/auth API surface stays identical to the previous supabase-js client.
export const crmSupabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Auto-detect if Supabase is unconfigured (using default placeholder values)
export const isCrmSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-url")
);

export const CRM_CONFIGURATION_ERROR = 'CRM database access is not configured. Contact the system administrator.';

// Production data must come from Supabase. Browser storage is never accepted
// as a substitute database because it bypasses authentication, RLS and shared
// state across users/devices.
async function runQuery<T>(supabaseFn: () => Promise<T>, _fallbackFn: () => T | Promise<T>): Promise<T> {
  if (!isCrmSupabaseConfigured) {
    throw new Error(CRM_CONFIGURATION_ERROR);
  }
  return await supabaseFn();
}

// ─── LocalStorage Database Fallback Implementation ──────────────────────────

function getList<T>(key: string, initial: T[]): T[] {
  if (typeof window === 'undefined') return initial;
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(val);
  } catch {
    return initial;
  }
}

function setList<T>(key: string, data: T[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// Initial Demo Seed Data
const INITIAL_CITIES: City[] = [
  { id: 'a3b7d1e2-0000-0000-0000-000000000001', name: 'Mumbai', state: 'Maharashtra', created_at: new Date().toISOString() },
  { id: 'a3b7d1e2-0000-0000-0000-000000000002', name: 'Delhi', state: 'Delhi', created_at: new Date().toISOString() },
  { id: 'a3b7d1e2-0000-0000-0000-000000000003', name: 'Jaipur', state: 'Rajasthan', created_at: new Date().toISOString() },
  { id: 'a3b7d1e2-0000-0000-0000-000000000004', name: 'Goa', state: 'Goa', created_at: new Date().toISOString() }
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'b4c8e2f3-0000-0000-0000-000000000001', name: 'Band & Ghodi', description: 'Traditional brass bands, bagpipers, and wedding carriages/horses.', created_at: new Date().toISOString() },
  { id: 'b4c8e2f3-0000-0000-0000-000000000002', name: 'Dhol Players', description: 'Energetic Punjabi Dhol and Nashik Dhol groups.', created_at: new Date().toISOString() },
  { id: 'b4c8e2f3-0000-0000-0000-000000000003', name: 'Safa & Pagri', description: 'Turban tying artists and fancy turbans.', created_at: new Date().toISOString() },
  { id: 'b4c8e2f3-0000-0000-0000-000000000004', name: 'Vintage Cars', description: 'Classic and luxury wedding cars.', created_at: new Date().toISOString() }
];

const INITIAL_PACKAGES: VendorPackage[] = [
  { id: 'c5d9f3a4-0000-0000-0000-000000000001', name: 'Silver Package', description: 'Basic listing, 5 photos upload, lead notifications.', price: 15000, features: 'Basic listing, 5 photos upload, lead notifications', created_at: new Date().toISOString() },
  { id: 'c5d9f3a4-0000-0000-0000-000000000002', name: 'Gold Package', description: 'Featured listing, 15 photos, verified badge, direct lead access.', price: 35000, features: 'Featured listing, 15 photos, verified badge, direct lead access', created_at: new Date().toISOString() },
  { id: 'c5d9f3a4-0000-0000-0000-000000000003', name: 'Diamond Package', description: 'Premium top-tier placement, video upload, custom route simulation integration, dedicated account support.', price: 75000, features: 'Premium placement, video upload, route simulation, dedicated support', created_at: new Date().toISOString() }
];

const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'd6e0a4b5-0000-0000-0000-000000000001',
    company_name: 'Jeet Ghodi & Brass Band',
    contact_person: 'Jeetendra Singh',
    mobile: '+91 9811223344',
    email: 'jeetghodi@example.com',
    city_id: 'a3b7d1e2-0000-0000-0000-000000000002',
    category_id: 'b4c8e2f3-0000-0000-0000-000000000001',
    package_id: 'c5d9f3a4-0000-0000-0000-000000000002',
    status: 'Converted',
    remarks: 'Highly professional. Has a white mare and 11-member band team. Verified deposit received.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'd6e0a4b5-0000-0000-0000-000000000002',
    company_name: 'Royal Safa Bandhni',
    contact_person: 'Tejabhai Patel',
    mobile: '+91 9822334455',
    email: 'tejasafa@example.com',
    city_id: 'a3b7d1e2-0000-0000-0000-000000000003',
    category_id: 'b4c8e2f3-0000-0000-0000-000000000003',
    package_id: 'c5d9f3a4-0000-0000-0000-000000000003',
    status: 'Interested',
    remarks: 'Interested in premium diamond package. Needs custom safe selector tool training.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'd6e0a4b5-0000-0000-0000-000000000003',
    company_name: 'Goa Dhol & Events',
    contact_person: 'Francis D\'Souza',
    mobile: '+91 9833445566',
    email: 'goadhol@example.com',
    city_id: 'a3b7d1e2-0000-0000-0000-000000000004',
    category_id: 'b4c8e2f3-0000-0000-0000-000000000002',
    package_id: 'c5d9f3a4-0000-0000-0000-000000000001',
    status: 'Contacted',
    remarks: 'Sent initial presentation. Awaiting callback.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const INITIAL_BARAAT_ENQUIRIES: BaraatEnquiry[] = [];

const INITIAL_LEADS: CustomerLead[] = [
  {
    id: 'e7f1b5c6-0000-0000-0000-000000000001',
    customer_name: 'Amit Sharma',
    mobile: '+91 9911223344',
    email: 'amit.sharma@example.com',
    city_id: 'a3b7d1e2-0000-0000-0000-000000000002',
    requirement: 'Wants vintage wedding car (Rolls Royce or similar) and premium Rajasthani Dhol team for Baraat entry.',
    event_date: '2026-11-20',
    package_discussed: 'Vintage Gold Package',
    status: 'Converted',
    remarks: 'Deposit of ₹10,000 received. Booked rolls royce and dhol team.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e7f1b5c6-0000-0000-0000-000000000002',
    customer_name: 'Rohan Mehta',
    mobile: '+91 9922334455',
    email: 'rohan.mehta@example.com',
    city_id: 'a3b7d1e2-0000-0000-0000-000000000001',
    requirement: 'Wants Ghodi with premium royal look, bagpipers band, and 200 safas for guest family.',
    event_date: '2026-12-15',
    package_discussed: 'Custom Diamond package',
    status: 'Interested',
    remarks: 'Very interested. Negotiating rates for safa tying artists.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const INITIAL_NOTES: Note[] = [
  { id: 'n1', entity_type: 'vendor', entity_id: 'd6e0a4b5-0000-0000-0000-000000000001', content: 'Called client. Discussed rates and details.', created_by: 'Tejabhai', created_at: new Date().toISOString() },
  { id: 'n2', entity_type: 'vendor', entity_id: 'd6e0a4b5-0000-0000-0000-000000000001', content: 'Sent payment link for token amount.', created_by: 'Admin', created_at: new Date().toISOString() },
  { id: 'n3', entity_type: 'lead', entity_id: 'e7f1b5c6-0000-0000-0000-000000000002', content: 'Shared quotes for Mumbai based vendors.', created_by: 'Tejabhai', created_at: new Date().toISOString() }
];

const INITIAL_FILES: UploadedFile[] = [];

// ─── Cities ──────────────────────────────────────────────────────────────────

export async function getCities(): Promise<City[]> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_cities').select('*').order('name');
      if (error) throw error;
      return data ?? [];
    },
    () => getList('crm_cities', INITIAL_CITIES).sort((a, b) => a.name.localeCompare(b.name))
  );
}

export async function createCity(name: string, state: string): Promise<City> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_cities').insert({ name, state }).select().single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_cities', INITIAL_CITIES);
      const city: City = { id: `city-${Date.now()}`, name, state, created_at: new Date().toISOString() };
      setList('crm_cities', [...list, city]);
      return city;
    }
  );
}

export async function updateCity(id: string, name: string, state: string): Promise<City> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_cities').update({ name, state }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_cities', INITIAL_CITIES);
      const index = list.findIndex(c => c.id === id);
      if (index === -1) throw new Error("City not found");
      list[index] = { ...list[index], name, state };
      setList('crm_cities', list);
      return list[index];
    }
  );
}

export async function deleteCity(id: string): Promise<void> {
  return runQuery(
    async () => {
      const { error } = await crmSupabase.from('crm_cities').delete().eq('id', id);
      if (error) throw error;
    },
    () => {
      const list = getList('crm_cities', INITIAL_CITIES);
      setList('crm_cities', list.filter(c => c.id !== id));
    }
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_categories').select('*').order('name');
      if (error) throw error;
      return data ?? [];
    },
    () => getList('crm_categories', INITIAL_CATEGORIES).sort((a, b) => a.name.localeCompare(b.name))
  );
}

export async function createCategory(name: string, description: string): Promise<Category> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_categories').insert({ name, description }).select().single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_categories', INITIAL_CATEGORIES);
      const cat: Category = { id: `cat-${Date.now()}`, name, description, created_at: new Date().toISOString() };
      setList('crm_categories', [...list, cat]);
      return cat;
    }
  );
}

export async function updateCategory(id: string, name: string, description: string): Promise<Category> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_categories').update({ name, description }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_categories', INITIAL_CATEGORIES);
      const index = list.findIndex(c => c.id === id);
      if (index === -1) throw new Error("Category not found");
      list[index] = { ...list[index], name, description };
      setList('crm_categories', list);
      return list[index];
    }
  );
}

export async function deleteCategory(id: string): Promise<void> {
  return runQuery(
    async () => {
      const { error } = await crmSupabase.from('crm_categories').delete().eq('id', id);
      if (error) throw error;
    },
    () => {
      const list = getList('crm_categories', INITIAL_CATEGORIES);
      setList('crm_categories', list.filter(c => c.id !== id));
    }
  );
}

// ─── Vendor Packages ──────────────────────────────────────────────────────────

export async function getPackages(): Promise<VendorPackage[]> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_vendor_packages').select('*').order('name');
      if (error) throw error;
      return data ?? [];
    },
    () => getList('crm_vendor_packages', INITIAL_PACKAGES).sort((a, b) => a.name.localeCompare(b.name))
  );
}

export async function createPackage(payload: Partial<VendorPackage>): Promise<VendorPackage> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_vendor_packages').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_vendor_packages', INITIAL_PACKAGES);
      const pkg: VendorPackage = {
        ...payload,
        id: `pkg-${Date.now()}`,
        name: payload.name || '',
        description: payload.description || '',
        price: payload.price || 0,
        features: payload.features || '',
        created_at: new Date().toISOString()
      };
      setList('crm_vendor_packages', [...list, pkg]);
      return pkg;
    }
  );
}

export async function updatePackage(id: string, payload: Partial<VendorPackage>): Promise<VendorPackage> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_vendor_packages').update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_vendor_packages', INITIAL_PACKAGES);
      const index = list.findIndex(c => c.id === id);
      if (index === -1) throw new Error("Package not found");
      list[index] = { ...list[index], ...payload };
      setList('crm_vendor_packages', list);
      return list[index];
    }
  );
}

export async function deletePackage(id: string): Promise<void> {
  return runQuery(
    async () => {
      const { error } = await crmSupabase.from('crm_vendor_packages').delete().eq('id', id);
      if (error) throw error;
    },
    () => {
      const list = getList('crm_vendor_packages', INITIAL_PACKAGES);
      setList('crm_vendor_packages', list.filter(c => c.id !== id));
    }
  );
}

// ─── Vendors ─────────────────────────────────────────────────────────────────

export async function getVendors(filters?: VendorFilters): Promise<Vendor[]> {
  return runQuery(
    async () => {
      let query = crmSupabase
        .from('crm_vendors')
        .select(`
          *,
          city:crm_cities(id, name, state),
          category:crm_categories(id, name),
          vendor_package:crm_vendor_packages(id, name, price)
        `)
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(
          `company_name.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%,mobile.ilike.%${filters.search}%`
        );
      }
      if (filters?.city_id) query = query.eq('city_id', filters.city_id);
      if (filters?.category_id) query = query.eq('category_id', filters.category_id);
      if (filters?.status) query = query.eq('status', filters.status);

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    () => {
      let list = getList('crm_vendors', INITIAL_VENDORS);
      const cities = getList('crm_cities', INITIAL_CITIES);
      const categories = getList('crm_categories', INITIAL_CATEGORIES);
      const packages = getList('crm_vendor_packages', INITIAL_PACKAGES);

      list = list.map(v => ({
        ...v,
        city: cities.find(c => c.id === v.city_id) || undefined,
        category: categories.find(c => c.id === v.category_id) || undefined,
        vendor_package: packages.find(p => p.id === v.package_id) || undefined
      }));

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        list = list.filter(v =>
          v.company_name.toLowerCase().includes(search) ||
          v.contact_person.toLowerCase().includes(search) ||
          v.mobile.toLowerCase().includes(search)
        );
      }
      if (filters?.city_id) list = list.filter(v => v.city_id === filters.city_id);
      if (filters?.category_id) list = list.filter(v => v.category_id === filters.category_id);
      if (filters?.status) list = list.filter(v => v.status === filters.status);

      return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
  );
}

export async function getVendorById(id: string): Promise<Vendor | null> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase
        .from('crm_vendors')
        .select(`
          *,
          city:crm_cities(id, name, state),
          category:crm_categories(id, name),
          vendor_package:crm_vendor_packages(id, name, price)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_vendors', INITIAL_VENDORS);
      const v = list.find(x => x.id === id);
      if (!v) return null;

      const cities = getList('crm_cities', INITIAL_CITIES);
      const categories = getList('crm_categories', INITIAL_CATEGORIES);
      const packages = getList('crm_vendor_packages', INITIAL_PACKAGES);

      return {
        ...v,
        city: cities.find(c => c.id === v.city_id) || undefined,
        category: categories.find(c => c.id === v.category_id) || undefined,
        vendor_package: packages.find(p => p.id === v.package_id) || undefined
      };
    }
  );
}

export async function createVendor(payload: VendorFormData): Promise<Vendor> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase
        .from('crm_vendors')
        .insert({
          ...payload,
          city_id: payload.city_id || null,
          category_id: payload.category_id || null,
          package_id: payload.package_id || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_vendors', INITIAL_VENDORS);
      const v: Vendor = {
        id: `vendor-${Date.now()}`,
        company_name: payload.company_name,
        contact_person: payload.contact_person,
        mobile: payload.mobile,
        email: payload.email || '',
        city_id: payload.city_id || null,
        category_id: payload.category_id || null,
        package_id: payload.package_id || null,
        status: payload.status || 'New',
        remarks: payload.remarks || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setList('crm_vendors', [...list, v]);
      return v;
    }
  );
}

export async function updateVendor(id: string, payload: Partial<VendorFormData>): Promise<Vendor> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase
        .from('crm_vendors')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_vendors', INITIAL_VENDORS);
      const index = list.findIndex(v => v.id === id);
      if (index === -1) throw new Error("Vendor not found");
      list[index] = { ...list[index], ...payload, updated_at: new Date().toISOString() };
      setList('crm_vendors', list);
      return list[index];
    }
  );
}

export async function deleteVendor(id: string): Promise<void> {
  return runQuery(
    async () => {
      const { error } = await crmSupabase.from('crm_vendors').delete().eq('id', id);
      if (error) throw error;
    },
    () => {
      const list = getList('crm_vendors', INITIAL_VENDORS);
      setList('crm_vendors', list.filter(v => v.id !== id));
    }
  );
}

export async function getVendorStats(): Promise<VendorStats> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_vendors').select('status');
      if (error) throw error;
      const vendors = data ?? [];
      return {
        total: vendors.length,
        new: vendors.filter(v => v.status === 'New').length,
        contacted: vendors.filter(v => v.status === 'Contacted').length,
        interested: vendors.filter(v => v.status === 'Interested').length,
        converted: vendors.filter(v => v.status === 'Converted').length,
        lost: vendors.filter(v => v.status === 'Lost').length,
      };
    },
    () => {
      const vendors = getList('crm_vendors', INITIAL_VENDORS);
      return {
        total: vendors.length,
        new: vendors.filter(v => v.status === 'New').length,
        contacted: vendors.filter(v => v.status === 'Contacted').length,
        interested: vendors.filter(v => v.status === 'Interested').length,
        converted: vendors.filter(v => v.status === 'Converted').length,
        lost: vendors.filter(v => v.status === 'Lost').length,
      };
    }
  );
}

// ─── Customer Leads ───────────────────────────────────────────────────────────

export async function getLeads(filters?: LeadFilters): Promise<CustomerLead[]> {
  return runQuery(
    async () => {
      let query = crmSupabase
        .from('crm_customer_leads')
        .select(`
          *,
          city:crm_cities(id, name, state)
        `)
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(
          `customer_name.ilike.%${filters.search}%,mobile.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }
      if (filters?.city_id) query = query.eq('city_id', filters.city_id);
      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.event_date_from) query = query.gte('event_date', filters.event_date_from);
      if (filters?.event_date_to) query = query.lte('event_date', filters.event_date_to);

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    () => {
      let list = getList('crm_customer_leads', INITIAL_LEADS);
      const cities = getList('crm_cities', INITIAL_CITIES);

      list = list.map(l => ({
        ...l,
        city: cities.find(c => c.id === l.city_id) || undefined
      }));

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        list = list.filter(l =>
          l.customer_name.toLowerCase().includes(search) ||
          l.mobile.toLowerCase().includes(search) ||
          (l.email && l.email.toLowerCase().includes(search))
        );
      }
      if (filters?.city_id) list = list.filter(l => l.city_id === filters.city_id);
      if (filters?.status) list = list.filter(l => l.status === filters.status);
      if (filters?.event_date_from) list = list.filter(l => l.event_date && l.event_date >= filters.event_date_from!);
      if (filters?.event_date_to) list = list.filter(l => l.event_date && l.event_date <= filters.event_date_to!);

      return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
  );
}

export async function getLeadById(id: string): Promise<CustomerLead | null> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase
        .from('crm_customer_leads')
        .select(`
          *,
          city:crm_cities(id, name, state)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_customer_leads', INITIAL_LEADS);
      const l = list.find(x => x.id === id);
      if (!l) return null;

      const cities = getList('crm_cities', INITIAL_CITIES);
      return {
        ...l,
        city: cities.find(c => c.id === l.city_id) || undefined
      };
    }
  );
}

export async function createLead(payload: LeadFormData): Promise<CustomerLead> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase
        .from('crm_customer_leads')
        .insert({
          ...payload,
          city_id: payload.city_id || null,
          event_date: payload.event_date || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_customer_leads', INITIAL_LEADS);
      const l: CustomerLead = {
        id: `lead-${Date.now()}`,
        customer_name: payload.customer_name,
        mobile: payload.mobile,
        email: payload.email || '',
        city_id: payload.city_id || null,
        requirement: payload.requirement || '',
        event_date: payload.event_date || null,
        package_discussed: payload.package_discussed || '',
        status: payload.status || 'New',
        remarks: payload.remarks || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setList('crm_customer_leads', [...list, l]);
      return l;
    }
  );
}

export async function updateLead(id: string, payload: Partial<LeadFormData>): Promise<CustomerLead> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase
        .from('crm_customer_leads')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_customer_leads', INITIAL_LEADS);
      const index = list.findIndex(l => l.id === id);
      if (index === -1) throw new Error("Lead not found");
      list[index] = { ...list[index], ...payload, updated_at: new Date().toISOString() };
      setList('crm_customer_leads', list);
      return list[index];
    }
  );
}

export async function deleteLead(id: string): Promise<void> {
  return runQuery(
    async () => {
      const { error } = await crmSupabase.from('crm_customer_leads').delete().eq('id', id);
      if (error) throw error;
    },
    () => {
      const list = getList('crm_customer_leads', INITIAL_LEADS);
      setList('crm_customer_leads', list.filter(l => l.id !== id));
    }
  );
}

// ─── Baraat Package Enquiries (separate module from Customer Leads) ─────────

export async function getBaraatEnquiries(filters?: BaraatEnquiryFilters): Promise<BaraatEnquiry[]> {
  return runQuery(
    async () => {
      let query = crmSupabase
        .from('crm_baraat_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(
          `customer_name.ilike.%${filters.search}%,mobile.ilike.%${filters.search}%`
        );
      }
      if (filters?.status) query = query.eq('status', filters.status);

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    () => {
      let list = getList('crm_baraat_enquiries', INITIAL_BARAAT_ENQUIRIES);

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        list = list.filter(e =>
          e.customer_name.toLowerCase().includes(search) ||
          e.mobile.toLowerCase().includes(search)
        );
      }
      if (filters?.status) list = list.filter(e => e.status === filters.status);

      return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
  );
}

export async function getBaraatEnquiryById(id: string): Promise<BaraatEnquiry | null> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase
        .from('crm_baraat_enquiries')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_baraat_enquiries', INITIAL_BARAAT_ENQUIRIES);
      return list.find((entry) => entry.id === id) ?? null;
    }
  );
}

export async function createBaraatEnquiry(payload: {
  customer_name: string;
  event_date: string;
  mobile: string;
  package_name: string;
}): Promise<BaraatEnquiry> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase
        .from('crm_baraat_enquiries')
        .insert({ ...payload, status: 'New' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_baraat_enquiries', INITIAL_BARAAT_ENQUIRIES);
      const e: BaraatEnquiry = {
        id: `baraat-${Date.now()}`,
        customer_name: payload.customer_name,
        event_date: payload.event_date,
        mobile: payload.mobile,
        package_name: payload.package_name,
        status: 'New',
        remarks: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setList('crm_baraat_enquiries', [...list, e]);
      return e;
    }
  );
}

export async function updateBaraatEnquiryStatus(id: string, status: BaraatEnquiry['status']): Promise<BaraatEnquiry> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase
        .from('crm_baraat_enquiries')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_baraat_enquiries', INITIAL_BARAAT_ENQUIRIES);
      const index = list.findIndex(e => e.id === id);
      if (index === -1) throw new Error("Enquiry not found");
      list[index] = { ...list[index], status, updated_at: new Date().toISOString() };
      setList('crm_baraat_enquiries', list);
      return list[index];
    }
  );
}

export async function deleteBaraatEnquiry(id: string): Promise<void> {
  return runQuery(
    async () => {
      const { error } = await crmSupabase.from('crm_baraat_enquiries').delete().eq('id', id);
      if (error) throw error;
    },
    () => {
      const list = getList('crm_baraat_enquiries', INITIAL_BARAAT_ENQUIRIES);
      setList('crm_baraat_enquiries', list.filter(e => e.id !== id));
    }
  );
}

export async function getLeadStats(): Promise<LeadStats> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_customer_leads').select('status, event_date');
      if (error) throw error;
      const leads = data ?? [];
      const today = new Date().toISOString().split('T')[0];
      return {
        total: leads.length,
        new: leads.filter(l => l.status === 'New').length,
        contacted: leads.filter(l => l.status === 'Contacted').length,
        interested: leads.filter(l => l.status === 'Interested').length,
        converted: leads.filter(l => l.status === 'Converted').length,
        lost: leads.filter(l => l.status === 'Lost').length,
        upcoming_events: leads.filter(l => l.event_date && l.event_date >= today).length,
      };
    },
    () => {
      const leads = getList('crm_customer_leads', INITIAL_LEADS);
      const today = new Date().toISOString().split('T')[0];
      return {
        total: leads.length,
        new: leads.filter(l => l.status === 'New').length,
        contacted: leads.filter(l => l.status === 'Contacted').length,
        interested: leads.filter(l => l.status === 'Interested').length,
        converted: leads.filter(l => l.status === 'Converted').length,
        lost: leads.filter(l => l.status === 'Lost').length,
        upcoming_events: leads.filter(l => l.event_date && l.event_date >= today).length,
      };
    }
  );
}

// ─── Notes ───────────────────────────────────────────────────────────────────

export async function getNotes(entityType: 'vendor' | 'lead', entityId: string): Promise<Note[]> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase
        .from('crm_notes')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    () => {
      const notes = getList('crm_notes', INITIAL_NOTES);
      return notes
        .filter(n => n.entity_type === entityType && n.entity_id === entityId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
  );
}

export async function createNote(
  entityType: 'vendor' | 'lead',
  entityId: string,
  content: string,
  createdBy?: string
): Promise<Note> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase
        .from('crm_notes')
        .insert({ entity_type: entityType, entity_id: entityId, content, created_by: createdBy ?? 'Admin' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    () => {
      const list = getList('crm_notes', INITIAL_NOTES);
      const note: Note = {
        id: `note-${Date.now()}`,
        entity_type: entityType,
        entity_id: entityId,
        content,
        created_by: createdBy ?? 'Admin',
        created_at: new Date().toISOString()
      };
      setList('crm_notes', [...list, note]);
      return note;
    }
  );
}

export async function deleteNote(id: string): Promise<void> {
  return runQuery(
    async () => {
      const { error } = await crmSupabase.from('crm_notes').delete().eq('id', id);
      if (error) throw error;
    },
    () => {
      const list = getList('crm_notes', INITIAL_NOTES);
      setList('crm_notes', list.filter(n => n.id !== id));
    }
  );
}

// ─── File Uploads ─────────────────────────────────────────────────────────────

async function signedCrmFile(pathOrUrl: string): Promise<string> {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const { data, error } = await crmSupabase.storage.from('crm-files').createSignedUrl(pathOrUrl, 3600);
  if (error) throw error;
  return data.signedUrl;
}

export async function getUploadedFiles(entityType: 'vendor' | 'lead' | 'agreement' | 'vendor_agreement', entityId: string): Promise<UploadedFile[]> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase
        .from('crm_uploaded_files')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return Promise.all((data ?? []).map(async file => ({ ...file, file_url: await signedCrmFile(file.file_url) })));
    },
    () => {
      const files = getList('crm_uploaded_files', INITIAL_FILES);
      return files
        .filter(f => f.entity_type === entityType && f.entity_id === entityId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
  );
}

export async function uploadFile(
  entityType: 'vendor' | 'lead' | 'agreement' | 'vendor_agreement',
  entityId: string,
  file: File
): Promise<UploadedFile> {
  return runQuery(
    async () => {
      const ext = file.name.split('.').pop();
      const fileName = `${entityType}/${entityId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await crmSupabase.storage
        .from('crm-files')
        .upload(fileName, file, { upsert: false });
      if (uploadError) throw uploadError;

      const { data, error } = await crmSupabase
        .from('crm_uploaded_files')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          file_name: file.name,
          file_url: fileName,
          file_type: file.type || ext,
          file_size: file.size,
        })
        .select()
        .single();
      if (error) throw error;
      return { ...data, file_url: await signedCrmFile(fileName) };
    },
    () => {
      const list = getList('crm_uploaded_files', INITIAL_FILES);
      const f: UploadedFile = {
        id: `file-${Date.now()}`,
        entity_type: entityType,
        entity_id: entityId,
        file_name: file.name,
        file_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&q=80',
        file_type: file.type || 'document',
        file_size: file.size,
        created_at: new Date().toISOString()
      };
      setList('crm_uploaded_files', [...list, f]);
      return f;
    }
  );
}

export async function deleteUploadedFile(id: string, _fileUrl: string): Promise<void> {
  return runQuery(
    async () => {
      const { data: stored } = await crmSupabase.from('crm_uploaded_files').select('file_url').eq('id', id).maybeSingle();
      if (stored?.file_url && !/^https?:\/\//i.test(stored.file_url)) await crmSupabase.storage.from('crm-files').remove([stored.file_url]);
      const { error } = await crmSupabase.from('crm_uploaded_files').delete().eq('id', id);
      if (error) throw error;
    },
    () => {
      const list = getList('crm_uploaded_files', INITIAL_FILES);
      setList('crm_uploaded_files', list.filter(f => f.id !== id));
    }
  );
}

// ─── Baraat Management Contracts ────────────────────────────────────────────

const INITIAL_AGREEMENTS: AgreementRecord[] = [];

function agreementRowToRecord(row: Record<string, unknown>): AgreementRecord {
  const payload = (row.payload ?? {}) as AgreementFormData;
  return {
    ...payload,
    id: String(row.id),
    agreement_number: String(row.agreement_number ?? payload.agreement_number),
    client_name: String(row.client_name ?? payload.client_name),
    mobile: String(row.mobile ?? payload.mobile),
    event_date: String(row.event_date ?? payload.event_date ?? ''),
    package_name: (row.package_name ?? payload.package_name) as AgreementFormData['package_name'],
    status: (row.status ?? payload.status) as AgreementFormData['status'],
    version: Number(row.version ?? payload.version ?? 1),
    final_amount: Number(row.final_amount ?? payload.final_amount ?? 0),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    verification_code: String(row.verification_code ?? ''),
  };
}

function agreementRecordToRow(payload: AgreementFormData) {
  return {
    agreement_number: payload.agreement_number,
    client_name: payload.client_name,
    mobile: payload.mobile,
    email: payload.email || null,
    event_date: payload.event_date || null,
    package_name: payload.package_name,
    status: payload.status,
    version: payload.version,
    final_amount: payload.final_amount,
    payload,
    updated_at: new Date().toISOString(),
  };
}

export async function getNextAgreementNumber(): Promise<string> {
  const year = new Date().getFullYear();
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.rpc('crm_next_agreement_number');
      if (error) throw error;
      return String(data);
    },
    () => {
      const list = getList('crm_agreements', INITIAL_AGREEMENTS);
      const sequence = list
        .map(item => item.agreement_number)
        .filter(number => number.startsWith(`PMB-CSA-${year}-`))
        .map(number => Number(number.split('-').pop()) || 0);
      return `PMB-CSA-${year}-${String(Math.max(0, ...sequence) + 1).padStart(4, '0')}`;
    }
  );
}

export async function getAgreements(filters?: Partial<AgreementFilters>): Promise<AgreementRecord[]> {
  return runQuery(
    async () => {
      let query = crmSupabase.from('crm_agreements').select('*').order('updated_at', { ascending: false });
      if (filters?.search) {
        const safeSearch = filters.search.replace(/[(),]/g, ' ');
        query = query.or(`agreement_number.ilike.%${safeSearch}%,client_name.ilike.%${safeSearch}%,mobile.ilike.%${safeSearch}%`);
      }
      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.package_name) query = query.eq('package_name', filters.package_name);
      if (filters?.event_date_from) query = query.gte('event_date', filters.event_date_from);
      if (filters?.event_date_to) query = query.lte('event_date', filters.event_date_to);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map(row => agreementRowToRecord(row));
    },
    () => {
      let list = getList('crm_agreements', INITIAL_AGREEMENTS);
      if (filters?.search) {
        const term = filters.search.toLowerCase();
        list = list.filter(item =>
          item.agreement_number.toLowerCase().includes(term) ||
          item.client_name.toLowerCase().includes(term) ||
          item.mobile.toLowerCase().includes(term) ||
          item.venue.toLowerCase().includes(term)
        );
      }
      if (filters?.status) list = list.filter(item => item.status === filters.status);
      if (filters?.package_name) list = list.filter(item => item.package_name === filters.package_name);
      if (filters?.event_date_from) list = list.filter(item => item.event_date >= filters.event_date_from!);
      if (filters?.event_date_to) list = list.filter(item => item.event_date <= filters.event_date_to!);
      return list.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    }
  );
}

export async function getAgreementById(id: string): Promise<AgreementRecord | null> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_agreements').select('*').eq('id', id).single();
      if (error) throw error;
      return agreementRowToRecord(data);
    },
    () => getList('crm_agreements', INITIAL_AGREEMENTS).find(item => item.id === id) ?? null
  );
}

export async function createAgreement(payload: AgreementFormData): Promise<AgreementRecord> {
  const now = new Date().toISOString();
  const activity: AgreementActivity = {
    id: `activity-${Date.now()}`,
    type: 'created',
    title: 'Agreement created',
    detail: `${payload.agreement_number} created as a ${payload.status.toLowerCase()}.`,
    actor: payload.sales_executive || 'CRM Admin',
    created_at: now,
  };
  const prepared = { ...payload, activity: [activity, ...payload.activity] };
  return runQuery(
    async () => {
      let candidate = prepared;

      for (let attempt = 0; attempt < 3; attempt += 1) {
        const { data, error } = await crmSupabase.from('crm_agreements').insert(agreementRecordToRow(candidate)).select().single();
        if (!error) return agreementRowToRecord(data);

        if (error.code !== '23505') {
          throw new Error(error.message || 'Unable to save agreement.');
        }

        // A completed insert followed by a repeated click must behave
        // idempotently: return the record that was already created.
        const { data: existing, error: existingError } = await crmSupabase
          .from('crm_agreements')
          .select('*')
          .eq('agreement_number', candidate.agreement_number)
          .maybeSingle();
        if (existingError) throw new Error(existingError.message || 'Unable to verify the saved agreement.');
        if (
          existing &&
          String(existing.client_name) === candidate.client_name &&
          String(existing.mobile) === candidate.mobile &&
          String(existing.event_date || '') === candidate.event_date &&
          Number(existing.final_amount) === Number(candidate.final_amount)
        ) {
          return agreementRowToRecord(existing);
        }

        // A different agreement claimed this number between form load and
        // submit. Allocate a fresh number and retry instead of failing.
        const nextNumber = await getNextAgreementNumber();
        candidate = {
          ...candidate,
          agreement_number: nextNumber,
          activity: candidate.activity.map((entry, index) => index === 0 ? {
            ...entry,
            detail: `${nextNumber} created as a ${candidate.status.toLowerCase()}.`,
          } : entry),
        };
      }

      throw new Error('Unable to allocate a unique agreement number. Please try again.');
    },
    () => {
      const list = getList('crm_agreements', INITIAL_AGREEMENTS);
      const record: AgreementRecord = {
        ...prepared,
        id: `agreement-${Date.now()}`,
        created_at: now,
        updated_at: now,
        verification_code: crypto.randomUUID().replace(/-/g, '').slice(0, 16),
      };
      setList('crm_agreements', [record, ...list]);
      return record;
    }
  );
}

export async function updateAgreement(id: string, payload: AgreementFormData, summary = 'Agreement details updated'): Promise<AgreementRecord> {
  const now = new Date().toISOString();
  const previous = await getAgreementById(id);
  if (!previous) throw new Error('Agreement not found');
  const { revisions: _oldRevisions, activity: _oldActivity, ...snapshot } = previous;
  void _oldRevisions;
  void _oldActivity;
  const revision = {
    version: previous.version,
    created_at: now,
    created_by: payload.sales_executive || 'CRM Admin',
    summary,
    snapshot,
  };
  const activity: AgreementActivity = {
    id: `activity-${Date.now()}`,
    type: previous.status === payload.status ? 'updated' : 'status',
    title: previous.status === payload.status ? 'Agreement updated' : `Status changed to ${payload.status}`,
    detail: summary,
    actor: payload.sales_executive || 'CRM Admin',
    created_at: now,
  };
  const prepared: AgreementFormData = {
    ...payload,
    version: previous.version + 1,
    revisions: [revision, ...previous.revisions],
    activity: [activity, ...previous.activity],
  };
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_agreements').update(agreementRecordToRow(prepared)).eq('id', id).select().single();
      if (error) throw error;
      return agreementRowToRecord(data);
    },
    () => {
      const list = getList('crm_agreements', INITIAL_AGREEMENTS);
      const index = list.findIndex(item => item.id === id);
      if (index < 0) throw new Error('Agreement not found');
      const record = { ...list[index], ...prepared, updated_at: now };
      list[index] = record;
      setList('crm_agreements', list);
      return record;
    }
  );
}

export async function appendAgreementActivity(id: string, entry: Omit<AgreementActivity, 'id' | 'created_at'>): Promise<void> {
  const record = await getAgreementById(id);
  if (!record) return;
  const activity: AgreementActivity = {
    ...entry,
    id: `activity-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const payload: AgreementFormData = { ...record, activity: [activity, ...record.activity] };
  return runQuery(
    async () => {
      const { error } = await crmSupabase.from('crm_agreements').update({
        payload,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
    },
    () => {
      const list = getList('crm_agreements', INITIAL_AGREEMENTS);
      const index = list.findIndex(item => item.id === id);
      if (index >= 0) {
        list[index] = { ...list[index], activity: payload.activity, updated_at: new Date().toISOString() };
        setList('crm_agreements', list);
      }
    }
  );
}

export async function duplicateAgreement(id: string): Promise<AgreementRecord> {
  const source = await getAgreementById(id);
  if (!source) throw new Error('Agreement not found');
  const agreementNumber = await getNextAgreementNumber();
  const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...payload } = source;
  void _id;
  void _createdAt;
  void _updatedAt;
  return createAgreement({
    ...payload,
    agreement_number: agreementNumber,
    version: 1,
    status: 'Draft',
    created_date: new Date().toISOString().slice(0, 10),
    attachments: [],
    revisions: [],
    activity: [{
      id: `activity-${Date.now()}-duplicate`,
      type: 'duplicated',
      title: 'Duplicated from agreement',
      detail: `Created from ${source.agreement_number}.`,
      actor: source.sales_executive || 'CRM Admin',
      created_at: new Date().toISOString(),
    }],
  });
}

export async function deleteAgreement(id: string): Promise<void> {
  return runQuery(
    async () => {
      const { error } = await crmSupabase.from('crm_agreements').delete().eq('id', id);
      if (error) throw error;
    },
    () => {
      const list = getList('crm_agreements', INITIAL_AGREEMENTS);
      setList('crm_agreements', list.filter(item => item.id !== id));
    }
  );
}

// ─── Vendor Agreements ───────────────────────────────────────────────────────
// Same read/write/versioning shape as the Baraat Management Contract
// functions above — payload is the source of truth, a handful of columns
// are mirrored out for fast list filtering.

const INITIAL_VENDOR_AGREEMENTS: VendorAgreementRecord[] = [];

function vendorAgreementRowToRecord(row: Record<string, unknown>): VendorAgreementRecord {
  const payload = (row.payload ?? {}) as VendorAgreementFormData;
  return {
    ...payload,
    id: String(row.id),
    vendor_agreement_number: String(row.vendor_agreement_number ?? payload.vendor_agreement_number),
    vendor_name: String(row.vendor_name ?? payload.vendor_name),
    mobile: String(row.mobile ?? payload.mobile),
    service_category: String(row.service_category ?? payload.service_category ?? ''),
    status: (row.status ?? payload.status) as VendorAgreementFormData['status'],
    version: Number(row.version ?? payload.version ?? 1),
    blacklist_status: (row.blacklist_status ?? payload.blacklist_status) as VendorAgreementFormData['blacklist_status'],
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    verification_code: String(row.verification_code ?? ''),
  };
}

function vendorAgreementRecordToRow(payload: VendorAgreementFormData) {
  return {
    vendor_agreement_number: payload.vendor_agreement_number,
    vendor_name: payload.vendor_name,
    business_name: payload.business_name || null,
    mobile: payload.mobile,
    email: payload.email || null,
    service_category: payload.service_category || null,
    status: payload.status,
    version: payload.version,
    agreement_end_date: payload.agreement_end_date || null,
    blacklist_status: payload.blacklist_status,
    payload,
    updated_at: new Date().toISOString(),
  };
}

export async function getNextVendorAgreementNumber(): Promise<string> {
  const year = new Date().getFullYear();
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.rpc('crm_next_vendor_agreement_number');
      if (error) throw error;
      return String(data);
    },
    () => {
      const list = getList('crm_vendor_agreements', INITIAL_VENDOR_AGREEMENTS);
      const sequence = list
        .map(item => item.vendor_agreement_number)
        .filter(number => number.startsWith(`PMB-VA-${year}-`))
        .map(number => Number(number.split('-').pop()) || 0);
      return `PMB-VA-${year}-${String(Math.max(0, ...sequence) + 1).padStart(4, '0')}`;
    }
  );
}

export async function getVendorAgreements(filters?: Partial<VendorAgreementFilters>): Promise<VendorAgreementRecord[]> {
  return runQuery(
    async () => {
      let query = crmSupabase.from('crm_vendor_agreements').select('*').order('updated_at', { ascending: false });
      if (filters?.search) {
        const safeSearch = filters.search.replace(/[(),]/g, ' ');
        query = query.or(`vendor_agreement_number.ilike.%${safeSearch}%,vendor_name.ilike.%${safeSearch}%,mobile.ilike.%${safeSearch}%`);
      }
      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.blacklist_status) query = query.eq('blacklist_status', filters.blacklist_status);
      if (filters?.service_category) query = query.eq('service_category', filters.service_category);
      const { data, error } = await query;
      if (error) throw error;
      let rows = (data ?? []).map(row => vendorAgreementRowToRecord(row));
      if (filters?.verification_status) rows = rows.filter(item => item.verification_status === filters.verification_status);
      return rows;
    },
    () => {
      let list = getList('crm_vendor_agreements', INITIAL_VENDOR_AGREEMENTS);
      if (filters?.search) {
        const term = filters.search.toLowerCase();
        list = list.filter(item =>
          item.vendor_agreement_number.toLowerCase().includes(term) ||
          item.vendor_name.toLowerCase().includes(term) ||
          item.mobile.toLowerCase().includes(term)
        );
      }
      if (filters?.status) list = list.filter(item => item.status === filters.status);
      if (filters?.blacklist_status) list = list.filter(item => item.blacklist_status === filters.blacklist_status);
      if (filters?.verification_status) list = list.filter(item => item.verification_status === filters.verification_status);
      if (filters?.service_category) list = list.filter(item => item.service_category === filters.service_category);
      return list.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    }
  );
}

export async function getVendorAgreementById(id: string): Promise<VendorAgreementRecord | null> {
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_vendor_agreements').select('*').eq('id', id).single();
      if (error) throw error;
      return vendorAgreementRowToRecord(data);
    },
    () => getList('crm_vendor_agreements', INITIAL_VENDOR_AGREEMENTS).find(item => item.id === id) ?? null
  );
}

export async function createVendorAgreement(payload: VendorAgreementFormData): Promise<VendorAgreementRecord> {
  const now = new Date().toISOString();
  const activity: VendorAgreementActivity = {
    id: `activity-${Date.now()}`,
    type: 'created',
    title: 'Vendor agreement created',
    detail: `${payload.vendor_agreement_number} created as a ${payload.status.toLowerCase()}.`,
    actor: 'CRM Admin',
    created_at: now,
  };
  const prepared = { ...payload, activity: [activity, ...payload.activity] };
  return runQuery(
    async () => {
      let candidate = prepared;

      for (let attempt = 0; attempt < 3; attempt += 1) {
        const { data, error } = await crmSupabase.from('crm_vendor_agreements').insert(vendorAgreementRecordToRow(candidate)).select().single();
        if (!error) return vendorAgreementRowToRecord(data);

        if (error.code !== '23505') {
          throw new Error(error.message || 'Unable to save vendor agreement.');
        }

        const { data: existing, error: existingError } = await crmSupabase
          .from('crm_vendor_agreements')
          .select('*')
          .eq('vendor_agreement_number', candidate.vendor_agreement_number)
          .maybeSingle();
        if (existingError) throw new Error(existingError.message || 'Unable to verify the saved vendor agreement.');
        if (
          existing &&
          String(existing.vendor_name) === candidate.vendor_name &&
          String(existing.mobile) === candidate.mobile
        ) {
          return vendorAgreementRowToRecord(existing);
        }

        const nextNumber = await getNextVendorAgreementNumber();
        candidate = {
          ...candidate,
          vendor_agreement_number: nextNumber,
          activity: candidate.activity.map((entry, index) => index === 0 ? {
            ...entry,
            detail: `${nextNumber} created as a ${candidate.status.toLowerCase()}.`,
          } : entry),
        };
      }

      throw new Error('Unable to allocate a unique vendor agreement number. Please try again.');
    },
    () => {
      const list = getList('crm_vendor_agreements', INITIAL_VENDOR_AGREEMENTS);
      const record: VendorAgreementRecord = {
        ...prepared,
        id: `vendor-agreement-${Date.now()}`,
        created_at: now,
        updated_at: now,
        verification_code: crypto.randomUUID().replace(/-/g, '').slice(0, 16),
      };
      setList('crm_vendor_agreements', [record, ...list]);
      return record;
    }
  );
}

export async function updateVendorAgreement(id: string, payload: VendorAgreementFormData, summary = 'Vendor agreement details updated'): Promise<VendorAgreementRecord> {
  const now = new Date().toISOString();
  const previous = await getVendorAgreementById(id);
  if (!previous) throw new Error('Vendor agreement not found');
  const { revisions: _oldRevisions, activity: _oldActivity, ...snapshot } = previous;
  void _oldRevisions;
  void _oldActivity;
  const revision = {
    version: previous.version,
    created_at: now,
    created_by: 'CRM Admin',
    summary,
    snapshot,
  };
  const activity: VendorAgreementActivity = {
    id: `activity-${Date.now()}`,
    type: previous.status === payload.status ? 'updated' : 'status',
    title: previous.status === payload.status ? 'Vendor agreement updated' : `Status changed to ${payload.status}`,
    detail: summary,
    actor: 'CRM Admin',
    created_at: now,
  };
  const prepared: VendorAgreementFormData = {
    ...payload,
    version: previous.version + 1,
    revisions: [revision, ...previous.revisions],
    activity: [activity, ...previous.activity],
  };
  return runQuery(
    async () => {
      const { data, error } = await crmSupabase.from('crm_vendor_agreements').update(vendorAgreementRecordToRow(prepared)).eq('id', id).select().single();
      if (error) throw error;
      return vendorAgreementRowToRecord(data);
    },
    () => {
      const list = getList('crm_vendor_agreements', INITIAL_VENDOR_AGREEMENTS);
      const index = list.findIndex(item => item.id === id);
      if (index < 0) throw new Error('Vendor agreement not found');
      const record = { ...list[index], ...prepared, updated_at: now };
      list[index] = record;
      setList('crm_vendor_agreements', list);
      return record;
    }
  );
}

export async function appendVendorAgreementActivity(id: string, entry: Omit<VendorAgreementActivity, 'id' | 'created_at'>): Promise<void> {
  const record = await getVendorAgreementById(id);
  if (!record) return;
  const activity: VendorAgreementActivity = {
    ...entry,
    id: `activity-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const payload: VendorAgreementFormData = { ...record, activity: [activity, ...record.activity] };
  return runQuery(
    async () => {
      const { error } = await crmSupabase.from('crm_vendor_agreements').update({
        payload,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
    },
    () => {
      const list = getList('crm_vendor_agreements', INITIAL_VENDOR_AGREEMENTS);
      const index = list.findIndex(item => item.id === id);
      if (index >= 0) {
        list[index] = { ...list[index], activity: payload.activity, updated_at: new Date().toISOString() };
        setList('crm_vendor_agreements', list);
      }
    }
  );
}

export async function duplicateVendorAgreement(id: string): Promise<VendorAgreementRecord> {
  const source = await getVendorAgreementById(id);
  if (!source) throw new Error('Vendor agreement not found');
  const vendorAgreementNumber = await getNextVendorAgreementNumber();
  const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...payload } = source;
  void _id;
  void _createdAt;
  void _updatedAt;
  return createVendorAgreement({
    ...payload,
    vendor_agreement_number: vendorAgreementNumber,
    version: 1,
    status: 'Draft',
    created_date: new Date().toISOString().slice(0, 10),
    documents: [],
    revisions: [],
    activity: [{
      id: `activity-${Date.now()}-duplicate`,
      type: 'duplicated',
      title: 'Duplicated from vendor agreement',
      detail: `Created from ${source.vendor_agreement_number}.`,
      actor: 'CRM Admin',
      created_at: new Date().toISOString(),
    }],
  });
}

export async function deleteVendorAgreement(id: string): Promise<void> {
  return runQuery(
    async () => {
      const { error } = await crmSupabase.from('crm_vendor_agreements').delete().eq('id', id);
      if (error) throw error;
    },
    () => {
      const list = getList('crm_vendor_agreements', INITIAL_VENDOR_AGREEMENTS);
      setList('crm_vendor_agreements', list.filter(item => item.id !== id));
    }
  );
}
