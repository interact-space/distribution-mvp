import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const openProject = (projectId) => {
    setSelectedProjectId(projectId);
    setCurrentPage("project-detail");
  };

  const goBackToProjects = () => {
    setSelectedProjectId(null);
    setCurrentPage("projects");
  };

  let content = null;

  if (currentPage === "dashboard") {
    content = <DashboardPage />;
  } else if (currentPage === "projects") {
    content = <ProjectsPage onOpenProject={openProject} />;
  } else if (currentPage === "project-detail") {
    content = <ProjectDetailPage projectId={selectedProjectId} onBack={goBackToProjects} />;
  }

  return (
    <div className="flex min-h-screen bg-neutral-100 text-neutral-900">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1">{content}</div>
    </div>
  );
}