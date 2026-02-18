import AdminLayout from "@/components/admin/AdminLayout";
import BrandsAdminPanel from "@/components/admin/BrandsAdminPanel";
import { db } from "@/lib/db";
import type { Brand } from "@/types/brand";

export default async function AdminBrandsPage() {
  let initialBrands: Brand[] = [];
  let initialError = "";
  try {
    initialBrands = await db.brands.getAll();
  } catch {
    initialError =
      "Brand data is unavailable. Check Google Sheets environment variables.";
  }
  const sheetsConnected = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
      process.env.GOOGLE_SHEETS_ID
  );

  return (
    <AdminLayout
      title="Brands"
      description="Manage brand logos for the portfolio grid."
    >
      <BrandsAdminPanel
        initialBrands={initialBrands}
        initialError={initialError}
        sheetsConnected={sheetsConnected}
      />
    </AdminLayout>
  );
}

