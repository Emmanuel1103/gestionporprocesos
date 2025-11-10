import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import Inicio from "./Inicio";
import Tareas from "./Tareas";

const Index = () => {
  const [currentSection, setCurrentSection] = useState<"inicio" | "tareas">("inicio");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AppSidebar onSectionChange={setCurrentSection} currentSection={currentSection} />

      {/* Main */}
      <main className="flex-1 ml-64">
        <div className="container mx-auto py-8 px-6">
          {currentSection === "inicio" ? <Inicio /> : <Tareas />}
        </div>
      </main>
    </div>
  );
};

export default Index;
