import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Task, TaskPriority, TaskStatus } from "@/src/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Calendar, CheckCircle2, Circle, Clock, MoreVertical } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/src/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { useTaskStore } from "@/src/store/useTaskStore"

interface TaskCardProps {
  task: Task
  isOverlay?: boolean
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const { moveTask, deleteTask } = useTaskStore()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "high": return "destructive"
      case "medium": return "default"
      case "low": return "secondary"
      default: return "default"
    }
  }

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "done": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case "in-progress": return <Clock className="h-4 w-4 text-blue-500" />
      case "todo": return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow bg-background relative",
        isOverlay && "shadow-xl ring-2 ring-primary/20 rotate-2"
      )}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon(task.status)}
          <Badge variant={getPriorityColor(task.priority)} className="capitalize text-[10px] px-1.5 py-0">
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardTitle className="text-sm font-medium mb-1.5 line-clamp-2 leading-tight">{task.title}</CardTitle>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-[10px] text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No due date"}
        </div>
        
        {/* Dropdown wrapped in a div that stops pointer events from bubbling to dnd-kit */}
        <div 
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="z-10"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => void moveTask(task.id, "todo")}>Mark as To Do</DropdownMenuItem>
              <DropdownMenuItem onClick={() => void moveTask(task.id, "in-progress")}>Mark In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => void moveTask(task.id, "done")}>Mark as Done</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => void deleteTask(task.id)}>Delete Task</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  )
}
