import { useState, useEffect } from "react";
import { Task, TaskFollowUp } from "@/types/task";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Flag, CheckCircle2, FileText, Trash2, Edit2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const THEMES = ["Tecnología", "Salud", "Educación", "Infraestructura", "Gestión Administrativa"];
const ACTIVITIES = [
  "Desarrollo e implementación",
  "Organización de jornada",
  "Impartir talleres",
  "Renovación de infraestructura",
  "Selección y entrega",
  "Revisión integral"
];

interface TaskModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskModal = ({ task, open, onClose, onSave, onDelete }: TaskModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(task);
  const [editingFollowUpId, setEditingFollowUpId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setEditedTask(task);
    setIsEditing(!task || !task.id); // Auto-edit mode for new tasks
  }, [task]);

  const handleSave = () => {
    if (editedTask) {
      // Validate required fields (fecha de finalización y seguimientos son opcionales)
      if (!editedTask.theme?.trim()) {
        toast({
          title: "Campo requerido",
          description: "El tema es obligatorio",
          variant: "destructive",
        });
        return;
      }
      if (!editedTask.activity?.trim()) {
        toast({
          title: "Campo requerido",
          description: "La actividad es obligatoria",
          variant: "destructive",
        });
        return;
      }
      if (!editedTask.responsible?.trim()) {
        toast({
          title: "Campo requerido",
          description: "El responsable es obligatorio",
          variant: "destructive",
        });
        return;
      }

      // Process follow-up if there's new data
      if (editedTask.description && editedTask.description.includes('|')) {
        const [date, comment] = editedTask.description.split('|');
        if (comment.trim()) {
          const newFollowUp: TaskFollowUp = {
            id: Date.now().toString(),
            date: date,
            comment: comment.trim(),
          };
          const updatedTask = {
            ...editedTask,
            followUps: [...(editedTask.followUps || []), newFollowUp],
            description: '',
          };
          onSave(updatedTask);
        } else {
          onSave({ ...editedTask, description: '' });
        }
      } else {
        onSave(editedTask);
      }
      setIsEditing(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
    setEditingFollowUpId(null);
    onClose();
  };

  const handleDeleteClick = () => {
    if (!editedTask?.id) return;

    // First confirmation
    const firstConfirm = window.confirm(
      "⚠️ Al borrar esta tarea, también se eliminará del archivo Excel. ¿Está seguro de continuar?"
    );

    if (firstConfirm) {
      // Second confirmation
      const secondConfirm = window.confirm(
        "⚠️ CONFIRMACIÓN FINAL: Esta acción no se puede deshacer. ¿Desea eliminar esta tarea definitivamente?"
      );

      if (secondConfirm && onDelete) {
        onDelete(editedTask.id);
        toast({
          title: "Tarea eliminada",
          description: "La tarea ha sido eliminada correctamente",
        });
        onClose();
      }
    }
  };

  const handleDeleteFollowUp = (followUpId: string) => {
    if (editedTask) {
      const updatedFollowUps = editedTask.followUps?.filter(f => f.id !== followUpId) || [];
      setEditedTask({ ...editedTask, followUps: updatedFollowUps });
    }
  };

  const handleEditFollowUp = (followUpId: string, newComment: string) => {
    if (editedTask) {
      const updatedFollowUps = editedTask.followUps?.map(f => 
        f.id === followUpId ? { ...f, comment: newComment } : f
      ) || [];
      setEditedTask({ ...editedTask, followUps: updatedFollowUps });
      setEditingFollowUpId(null);
    }
  };

  if (!editedTask) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finalizada":
        return "text-status-completed";
      case "En gestión":
        return "text-status-in-progress";
      case "Pendiente":
        return "text-status-pending";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-primary rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Editar Tarea" : editedTask?.activity || "Nueva Tarea"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              {isEditing ? (
                <Select
                  value={editedTask.theme}
                  onValueChange={(value) => setEditedTask({ ...editedTask, theme: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tema" />
                  </SelectTrigger>
                  <SelectContent>
                    {THEMES.map((theme) => (
                      <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-foreground">{task?.theme}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Prioridad
              </Label>
              {isEditing ? (
                <Select
                  value={editedTask.priority.toString()}
                  onValueChange={(value) =>
                    setEditedTask({ ...editedTask, priority: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Alta (1)</SelectItem>
                    <SelectItem value="2">Media (2)</SelectItem>
                    <SelectItem value="3">Baja (3)</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-2xl font-bold text-primary">{task?.priority}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Actividad</Label>
            {isEditing ? (
              <Select
                value={editedTask.activity}
                onValueChange={(value) => setEditedTask({ ...editedTask, activity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar actividad" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITIES.map((activity) => (
                    <SelectItem key={activity} value={activity}>{activity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-foreground">{task?.activity}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Estado
              </Label>
              {isEditing ? (
                <Select
                  value={editedTask.status}
                  onValueChange={(value) =>
                    setEditedTask({ ...editedTask, status: value as Task["status"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En gestión">En gestión</SelectItem>
                    <SelectItem value="Finalizada">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full ${getStatusColor(task?.status || "Pendiente").replace("text-", "bg-")}`} />
                  <p className={`text-sm font-semibold ${getStatusColor(task?.status || "Pendiente")}`}>
                    {task?.status}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha de finalización
              </Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editedTask.deadline || ""}
                  onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
                />
              ) : (
                <p className="text-sm text-foreground">{task?.deadline ? new Date(task.deadline).toLocaleDateString("es-ES") : "No definida"}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Responsable
            </Label>
            {isEditing ? (
              <Input
                value={editedTask.responsible}
                onChange={(e) => setEditedTask({ ...editedTask, responsible: e.target.value })}
                placeholder="Nombre del responsable"
              />
            ) : (
              <p className="text-sm text-foreground">{task?.responsible}</p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-base font-semibold">Seguimientos</Label>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={editedTask.description?.split('|')[0] || new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      const currentComment = editedTask.description?.split('|')[1] || '';
                      setEditedTask({ ...editedTask, description: `${e.target.value}|${currentComment}` });
                    }}
                    className="flex-shrink-0 w-40"
                  />
                  <Textarea
                    value={editedTask.description?.split('|')[1] || ""}
                    onChange={(e) => {
                      const currentDate = editedTask.description?.split('|')[0] || new Date().toISOString().split('T')[0];
                      setEditedTask({ ...editedTask, description: `${currentDate}|${e.target.value}` });
                    }}
                    rows={3}
                    placeholder="Escribe un comentario de seguimiento..."
                    className="border-primary/30 rounded-lg flex-1"
                  />
                </div>
                {editedTask?.followUps && editedTask.followUps.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <p className="text-xs font-semibold text-muted-foreground">Seguimientos anteriores:</p>
                    {editedTask.followUps.map((followUp) => (
                      <div
                        key={followUp.id}
                        className="p-3 bg-muted/50 rounded-lg border border-primary/20 relative group"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-1">
                              {new Date(followUp.date).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </p>
                            {editingFollowUpId === followUp.id ? (
                              <div className="flex gap-2 items-center">
                                <Textarea
                                  defaultValue={followUp.comment}
                                  id={`edit-${followUp.id}`}
                                  rows={2}
                                  className="text-sm flex-1"
                                />
                                <div className="flex gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-primary"
                                    onClick={() => {
                                      const textarea = document.getElementById(`edit-${followUp.id}`) as HTMLTextAreaElement;
                                      handleEditFollowUp(followUp.id, textarea.value);
                                    }}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => setEditingFollowUpId(null)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-foreground">{followUp.comment}</p>
                            )}
                          </div>
                          {editingFollowUpId !== followUp.id && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => setEditingFollowUpId(followUp.id)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteFollowUp(followUp.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {editedTask?.followUps && editedTask.followUps.length > 0 ? (
                  <div className="space-y-2">
                    {editedTask.followUps.map((followUp) => (
                      <div
                        key={followUp.id}
                        className="p-3 bg-muted/50 rounded-lg border border-primary/20"
                      >
                        <p className="text-xs text-muted-foreground mb-1">
                          {new Date(followUp.date).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-foreground">{followUp.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay seguimientos registrados</p>
                )}
              </>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary-hover text-primary-foreground flex-1">
                Guardar Cambios
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
              {editedTask?.id && onDelete && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteClick}
                  className="text-destructive-foreground"
                >
                  Eliminar Tarea
                </Button>
              )}
              <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary-hover text-primary-foreground">
                Editar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
