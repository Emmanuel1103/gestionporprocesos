import { useState, useEffect } from "react";
import { FilterBar } from "@/components/FilterBar";
import { TaskGrid } from "@/components/TaskGrid";
import { TaskModal } from "@/components/TaskModal";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Task, TaskFilters } from "@/types/task";
import { getExcelTasks } from "@/api/getExcelTasks";

const Tareas = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("priority-asc");
  const [filters, setFilters] = useState<TaskFilters>({
    theme: "",
    activity: "",
    priority: "all",
    status: "all",
    responsible: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = await getExcelTasks();
        setTasks(data || []);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos desde Excel.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (updatedTask: Task) => {
    if (updatedTask.id) {
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    } else {
      const newTask = {
        ...updatedTask,
        id: Date.now().toString(),
        followUps: [],
      };
      setTasks([...tasks, newTask]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleClearFilters = () => {
    setFilters({
      theme: "",
      activity: "",
      priority: "all",
      status: "all",
      responsible: "",
    });
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filters.theme && !task.theme.toLowerCase().includes(filters.theme.toLowerCase()))
        return false;
      if (filters.activity && !task.activity.toLowerCase().includes(filters.activity.toLowerCase()))
        return false;
      if (filters.priority !== "all" && task.priority.toString() !== filters.priority) return false;
      if (filters.status !== "all" && task.status !== filters.status) return false;
      if (
        filters.responsible &&
        !task.responsible.toLowerCase().includes(filters.responsible.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "priority-asc":
          return a.priority - b.priority;
        case "priority-desc":
          return b.priority - a.priority;
        default:
          return a.priority - b.priority;
      }
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Tareas</h1>
        <p className="text-gray-500">
          Sistema de seguimiento y control de actividades institucionales
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 space-x-3">
          <Loader2 className="animate-spin w-10 h-10 text-primary" />
          <span className="text-lg text-gray-700">Cargando tareas...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 font-semibold">{error}</div>
      ) : (
        <>
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={handleClearFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />

          <TaskGrid tasks={filteredTasks} onTaskClick={handleTaskClick} viewMode={viewMode} />

          <Button
            onClick={() =>
              setSelectedTask({
                id: "",
                theme: "",
                activity: "",
                priority: 1,
                status: "Pendiente",
                responsible: "",
                deadline: "",
                description: "",
                followUps: [],
              })
            }
            className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary-hover transition-all hover:scale-110"
            size="icon"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </>
      )}

      <TaskModal
        task={selectedTask}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default Tareas;
