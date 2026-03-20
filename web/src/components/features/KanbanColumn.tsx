import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Task, TaskStatus } from "@/src/types"
import { TaskCard } from "./TaskCard"
import { cn } from "@/src/lib/utils"

interface KanbanColumnProps {
  id: TaskStatus
  title: string
  tasks: Task[]
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div className="flex flex-col w-full md:w-80 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 bg-muted/30 rounded-xl p-3 min-h-[200px] transition-colors",
          isOver && "bg-muted/60"
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}
