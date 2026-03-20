import { useEffect } from "react"
import { useTaskStore } from "@/src/store/useTaskStore"
import { useAuthStore } from "@/src/store/useAuthStore"
import DashboardLayout from "@/src/components/layout/DashboardLayout"
import { Card, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { CheckCircle2, Circle, Clock, Plus, ArrowRight, Calendar, MoreHorizontal } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function Dashboard() {
  const { tasks, fetchTasks } = useTaskStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (tasks.length === 0) {
      void fetchTasks().catch(() => undefined)
    }
  }, [fetchTasks, tasks.length])

  const todoCount = tasks.filter(t => t.status === "todo").length
  const inProgressCount = tasks.filter(t => t.status === "in-progress").length
  const doneCount = tasks.filter(t => t.status === "done").length

  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}, {user?.name?.split(' ')[0] || 'User'}</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your tasks today.</p>
          </div>
          <Button onClick={() => navigate('/tasks')} className="gap-2 rounded-full px-6 shadow-sm">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-none shadow-sm bg-blue-50/50 dark:bg-blue-950/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Circle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">To Do</p>
                <h3 className="text-3xl font-bold">{todoCount}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <h3 className="text-3xl font-bold">{inProgressCount}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-emerald-50/50 dark:bg-emerald-950/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <h3 className="text-3xl font-bold">{doneCount}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Recent Tasks</h2>
            <Link to="/tasks" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentTasks.map(task => (
              <Card key={task.id} className="group overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/tasks')}>
                <div className="h-32 bg-muted/50 p-4 flex flex-col justify-between border-b border-border/50">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                    }`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold line-clamp-2">{task.title}</h3>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      {task.status === 'done' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> :
                       task.status === 'in-progress' ? <Clock className="h-3.5 w-3.5 text-blue-500" /> :
                       <Circle className="h-3.5 w-3.5" />}
                      <span>{task.status === 'in-progress' ? 'In Progress' : task.status === 'done' ? 'Done' : 'To Do'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No date'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card
              className="border-dashed border-2 border-muted-foreground/20 shadow-none hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
              onClick={() => navigate('/tasks')}
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Plus className="h-5 w-5" />
              </div>
              <p className="font-medium text-sm">Create new task</p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
