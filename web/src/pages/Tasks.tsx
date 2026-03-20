import { useEffect, useState } from "react"
import { Plus, Search, Filter, CheckSquare } from "lucide-react"
import { useTaskStore } from "@/src/store/useTaskStore"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Task, TaskPriority, TaskStatus } from "@/src/types"
import DashboardLayout from "@/src/components/layout/DashboardLayout"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { toast } from "sonner"
import { KanbanBoard } from "@/src/components/features/KanbanBoard"

export default function Tasks() {
  const { tasks, addTask, fetchTasks, isLoading } = useTaskStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    void fetchTasks()
  }, [fetchTasks])

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddTask = async () => {
    if (!newTask.title) {
      toast.error("Title is required")
      return
    }

    await addTask({
      title: newTask.title ?? "",
      description: newTask.description || "",
      status: (newTask.status as TaskStatus) || "todo",
      priority: (newTask.priority as TaskPriority) || "medium",
      dueDate: newTask.dueDate || null,
    })

    setIsAddModalOpen(false)
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: new Date().toISOString().split('T')[0],
    })
    toast.success("Task created successfully")
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 h-[calc(100vh-8rem)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">Manage your daily tasks and projects.</p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newTask.title || ""}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="E.g. Update documentation"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTask.description || ""}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Add more details about this task..."
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select value={newTask.status} onValueChange={(v) => setNewTask({ ...newTask, status: v as TaskStatus })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Priority</Label>
                    <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v as TaskPriority })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate || ""}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button onClick={() => void handleAddTask()}>Create Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 w-full sm:w-auto" disabled>
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-sm text-muted-foreground">
              Loading tasks...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <CheckSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No tasks found</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {searchQuery ? "Try adjusting your search query." : "Create a new task to get started."}
              </p>
            </div>
          ) : (
            <KanbanBoard tasks={filteredTasks} />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
