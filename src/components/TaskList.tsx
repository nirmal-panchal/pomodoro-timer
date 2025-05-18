import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  pomodoroCount: number;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pomodoro-tasks");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem("pomodoro-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setTasks([
      {
        id: Date.now().toString(),
        title: newTask.trim(),
        completed: false,
        createdAt: Date.now(),
        pomodoroCount: 0,
      },
      ...tasks,
    ]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const newCompleted = !task.completed;
          if (newCompleted) {
            // Trigger confetti when task is completed
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
          return {
            ...task,
            completed: newCompleted,
            completedAt: newCompleted ? Date.now() : undefined,
          };
        }
        return task;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="!w-full">
      <div className="!flex !items-center !justify-between !mb-4 !px-1">
        <div className="!flex !gap-3 !text-xs">
          <span className="!text-zinc-500 dark:!text-zinc-400">
            Total: {tasks.length}
          </span>
          <span className="!text-zinc-500 dark:!text-zinc-400">
            Done: {tasks.filter((t) => t.completed).length}
          </span>
          <span className="!text-primary/70">
            🍅 {tasks.reduce((sum, t) => sum + t.pomodoroCount, 0)}
          </span>
        </div>
      </div>
      <form onSubmit={addTask} className="!mb-4">
        <div className="relative flex items-center">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="w-full bg-white/5 dark:bg-zinc-800/50 rounded-lg !pl-4 pr-12 !py-2.5 text-sm 
            border border-zinc-200 dark:border-zinc-700/50
            focus:outline-none focus:ring-2 focus:ring-primary/20
            placeholder:text-zinc-500 dark:placeholder:text-zinc-600
            text-zinc-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            className="absolute right-2 !p-1.5 rounded-md 
            bg-primary/10 hover:bg-primary/20 text-primary
            transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </form>

      <div className="!space-y-2 max-h-[280px] overflow-y-auto overflow-x-hidden !pr-1 custom-scrollbar">
        <AnimatePresence mode="popLayout" initial={false}>
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-300 dark:text-zinc-600 !mb-2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <path d="M7 11h10" />
                <path d="M7 15h8" />
                <path d="M7 19h6" />
              </svg>
              <p className="text-sm text-zinc-400 dark:text-zinc-600">
                No tasks yet. Add one to get started!
              </p>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -5 }}
                whileHover={{ scale: 1.005 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "group flex items-center !gap-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg !px-4 !py-3",
                  "border border-zinc-200 dark:border-zinc-700/50",
                  "transform transition-all duration-200 ease-in-out will-change-transform",
                  task.completed && "opacity-50"
                )}
              >
                <motion.button
                  onClick={() => toggleTask(task.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "!w-5 !h-5 !rounded-full !border-2 !flex !items-center !justify-center !transition-all !duration-200",
                    task.completed
                      ? "bg-primary border-primary text-white scale-100"
                      : "border-zinc-300 dark:border-zinc-600 hover:border-primary dark:hover:border-primary scale-90 hover:scale-100"
                  )}
                >
                  {task.completed && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  )}
                </motion.button>
                <span
                  className={cn(
                    "flex-1 text-sm transition-colors duration-200",
                    task.completed
                      ? "line-through text-zinc-400 dark:text-zinc-600"
                      : "text-zinc-700 dark:text-zinc-300"
                  )}
                >
                  {task.title}
                </span>
                {task.pomodoroCount > 0 && (
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="!px-2 !py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                  >
                    {task.pomodoroCount}x
                  </motion.span>
                )}
                <motion.button
                  onClick={() => deleteTask(task.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md
                  text-zinc-500 hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-400
                  hover:bg-zinc-100 dark:hover:bg-zinc-700/50
                  transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
