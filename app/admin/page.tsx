import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="layout-container flex h-full grow flex-col">
      <div className="gap-1 px-6 flex flex-1 justify-center py-5">
        <AdminDashboard />
      </div>
    </div>
  );
}

