import Header from "@/components/Header";
import StudentDashboard from "@/components/StudentDashboard";

export default function StudentDashboardPage() {
  return (
    <div className="layout-container flex h-full grow flex-col">
      <div className="gap-1 px-6 flex flex-1 justify-center py-5">
        <StudentDashboard />
      </div>
    </div>
  );
}

