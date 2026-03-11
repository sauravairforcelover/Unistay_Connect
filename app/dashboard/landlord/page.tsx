import LandlordDashboard from "@/components/LandlordDashboard";

export default function LandlordDashboardPage() {
  return (
    <div className="layout-container flex h-full grow flex-col">
      <div className="gap-1 px-6 flex flex-1 justify-center py-5">
        <LandlordDashboard />
      </div>
    </div>
  );
}

