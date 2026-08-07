# Plan My Baraat

Production-ready Next.js website for Plan My Baraat.

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm install
npm run build
npm start
```

## Deploy

The project can be deployed directly to Vercel or to any Node.js hosting
provider that supports Next.js 14.

For Vercel:

1. Extract the ZIP.
2. Upload or import the project folder.
3. Keep the framework preset as Next.js.
4. Use `npm run build` as the build command.
5. Add the CRM environment variables below. The protected portals fail closed until they are configured.

## CRM and database setup

Copy `.env.example` to `.env.local` and add the production values:

```env
NEXT_PUBLIC_SUPABASE_URL=
# Use either the current publishable key or the legacy anon key.
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_META_PIXEL_ID=
```

The public marketing pages run without Supabase. `/crm` and `/workspace` do
not: missing values redirect protected routes to a configuration error instead
of enabling a demo/offline database. Keep `SUPABASE_SERVICE_ROLE_KEY` server
only and never give it a `NEXT_PUBLIC_` prefix.

For a new Supabase project, run these in the SQL editor in order:

1. `app/crm/schema.sql`
2. `app/crm/production-completion.sql`

The second migration completes the auth/staff, attendance, quotations, tasks,
notifications, HR/payroll, verification, storage, and RLS objects used by the
application. It also removes only the fixed UUID demo rows from the legacy
schema. Create the first administrator in Supabase Auth, then update that
user's `crm_users.role` to `super_admin`. Staff accounts should subsequently be
created from Admin → Staff so Auth, `crm_users`, and `crm_staff` stay linked.
