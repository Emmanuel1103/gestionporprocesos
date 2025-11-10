import { Home, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  onSectionChange: (section: "inicio" | "tareas") => void;
  currentSection: "inicio" | "tareas";
}

export const AppSidebar = ({ onSectionChange, currentSection }: AppSidebarProps) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-green-600 text-white shadow-lg flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-white/20 flex items-center gap-3">
          <img
            src="/src/assets/logoFSD.png" // 👈 ruta del logo
            alt="Logo Fundación"
            className="w-10 h-10 object-contain" // 👈 ajusta tamaño y proporción
          />
          <div>
            <h1 className="text-lg font-semibold">Panel de Gestión</h1>
            <p className="text-sm text-white/70">FSD</p>
          </div>
        </div>

        <nav className="mt-6 flex flex-col gap-2 px-4">
          <button
            onClick={() => onSectionChange("inicio")}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/20",
              currentSection === "inicio" && "bg-white/25"
            )}
          >
            <Home size={20} />
            <span className="font-medium">Inicio</span>
          </button>

          <button
            onClick={() => onSectionChange("tareas")}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/20",
              currentSection === "tareas" && "bg-white/25"
            )}
          >
            <CheckSquare size={20} />
            <span className="font-medium">Tareas</span>
          </button>
        </nav>
      </div>

      <div className="p-4 text-center border-t border-white/20 text-sm text-white/60">
        © {new Date().getFullYear()} Gestion por procesos
      </div>
    </aside>
  );
};
