import AdminLayout from "@/components/admin/AdminLayout";
import BrandsAdminPanel from "@/components/admin/BrandsAdminPanel";
import { getBrands } from "@/lib/db";
import type { Brand } from "@/types/brand";

export default async function AdminBrandsPage() {
  let initialBrands: Brand[] = [];
  let initialError = "";
  try {
    initialBrands = await getBrands();
  } catch {
    initialError = "Brand data is unavailable.";
  }

  return (
    <AdminLayout
      title="Brands"
      description="Manage brand logos for the portfolio grid."
    >
      <BrandsAdminPanel
        initialBrands={initialBrands}
        initialError={initialError}
        sheetsConnected={false}
      />
    </AdminLayout>
  );
}

