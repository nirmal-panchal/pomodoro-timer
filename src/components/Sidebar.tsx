"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import toast from "react-hot-toast";
import { TaskList } from "./TaskList";

interface SidebarProps {
  focusTime: number;
  breakTime: number;
  onFocusTimeChange: (value: number) => void;
  onBreakTimeChange: (value: number) => void;
}

const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <motion.button
    className="relative flex items-center justify-center"
    onClick={onChange}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      initial={false}
      animate={{
        backgroundColor: checked
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(255, 255, 255, 0.1)",
      }}
      className="w-10 h-5 rounded-full flex items-center px-1"
    >
      <motion.div
        initial={false}
        animate={{
          x: checked ? "20px" : "6px",
          backgroundColor: checked
            ? "rgb(255, 255, 255)"
            : "rgb(161, 161, 170)",
        }}
        className="w-3.5 h-3.5 rounded-full"
      />
    </motion.div>
  </motion.button>
);

export function Sidebar({
  focusTime,
  breakTime,
  onFocusTimeChange,
  onBreakTimeChange,
}: SidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sidebarPosition, setSidebarPosition] = useState({ x: 0, y: 100 });
  const [isMounted, setIsMounted] = useState(false);
  const [notes, setNotes] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pomodoro-notes") || "";
    }
    return "";
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pomodoro-notifications") === "true";
    }
    return false;
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pomodoro-sound") === "true";
    }
    return false;
  });
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const { theme, setTheme } = useTheme();

  // Save settings to localStorage when they change
  useEffect(() => {
    if (notes) {
      localStorage.setItem("pomodoro-notes", notes);
    }
    localStorage.setItem(
      "pomodoro-notifications",
      notificationsEnabled.toString()
    );
    localStorage.setItem("pomodoro-sound", soundEnabled.toString());
  }, [notes, notificationsEnabled, soundEnabled]);

  // Initialize position after mount
  useEffect(() => {
    setSidebarPosition({
      x: window.innerWidth - 80,
      y: 100,
    });
    setIsMounted(true);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sidebarRef.current) return;

    isDragging.current = true;
    const rect = sidebarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      setSidebarPosition({
        x: Math.min(window.innerWidth - 60, Math.max(0, e.clientX - offsetX)),
        y: Math.min(window.innerHeight - 100, Math.max(0, e.clientY - offsetY)),
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarPosition((prev) => ({
        x: Math.min(window.innerWidth - 60, prev.x),
        y: Math.min(window.innerHeight - 100, prev.y),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Don't render until after mount to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={sidebarRef}
      style={{
        position: "fixed",
        left: `${sidebarPosition.x}px`,
        top: `${sidebarPosition.y}px`,
        zIndex: 50,
      }}
      className="flex items-start gap-2"
    >
      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "320px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl overflow-hidden"
            style={{ transform: "translateX(-100%)" }}
          >
            {activeSection === "notes" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <div className="!p-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      Quick Notes
                    </h3>
                    <button
                      onClick={() => setActiveSection(null)}
                      className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M12 4L4 12M4 4L12 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="!p-3">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-[200px] bg-zinc-100/50 dark:bg-zinc-800/50 rounded-lg !p-3 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
                    placeholder="Write your thoughts here..."
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => {
                        localStorage.setItem("pomodoro-notes", notes);
                        setActiveSection(null);
                      }}
                      className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Save & Close
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            {activeSection === "tasks" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <div className="!p-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      Tasks
                    </h3>
                    <button
                      onClick={() => setActiveSection(null)}
                      className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M12 4L4 12M4 4L12 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="!p-3">
                  <TaskList />
                </div>
              </motion.div>
            )}
            {activeSection === "settings" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <div className="!p-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      Settings
                    </h3>
                    <button
                      onClick={() => setActiveSection(null)}
                      className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M12 4L4 12M4 4L12 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="!p-3 !space-y-4">
                  <div className="!space-y-3">
                    <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      Timer Settings
                    </h4>
                    <div className="bg-zinc-100/50 dark:bg-zinc-800/50 rounded-lg !p-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-zinc-900 dark:text-zinc-200">
                          Focus Duration
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onFocusTimeChange(Math.max(300, focusTime - 300))
                            }
                            className="bg-zinc-200/50 dark:bg-zinc-700/50 hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 text-zinc-900 dark:text-zinc-200 w-8 h-8 rounded flex items-center justify-center transition-colors"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14" />
                            </svg>
                          </button>
                          <span className="w-12 text-center font-medium">
                            {focusTime / 60}m
                          </span>
                          <button
                            onClick={() =>
                              onFocusTimeChange(Math.min(3600, focusTime + 300))
                            }
                            className="bg-zinc-200/50 dark:bg-zinc-700/50 hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 text-zinc-900 dark:text-zinc-200 w-8 h-8 rounded flex items-center justify-center transition-colors"
                          >
                            <svg
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
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-900 dark:text-zinc-200">
                          Break Duration
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onBreakTimeChange(Math.max(60, breakTime - 60))
                            }
                            className="bg-zinc-200/50 dark:bg-zinc-700/50 hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 text-zinc-900 dark:text-zinc-200 w-8 h-8 rounded flex items-center justify-center transition-colors"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14" />
                            </svg>
                          </button>
                          <span className="w-12 text-center font-medium">
                            {breakTime / 60}m
                          </span>
                          <button
                            onClick={() =>
                              onBreakTimeChange(Math.min(1800, breakTime + 60))
                            }
                            className="bg-zinc-200/50 dark:bg-zinc-700/50 hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 text-zinc-900 dark:text-zinc-200 w-8 h-8 rounded flex items-center justify-center transition-colors"
                          >
                            <svg
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
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-100/50 dark:bg-zinc-800/50 rounded-lg !p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col">
                        <span className="text-zinc-900 dark:text-zinc-200">
                          Notifications
                        </span>
                        <p className="text-xs text-zinc-500 mt-1">
                          Get notified when your timer ends
                        </p>
                      </div>
                      <Checkbox
                        checked={notificationsEnabled}
                        onChange={async () => {
                          if (!notificationsEnabled) {
                            try {
                              const permission =
                                await Notification.requestPermission();
                              if (permission === "granted") {
                                setNotificationsEnabled(true);
                                toast.success("Notifications enabled!");
                              } else {
                                toast.error(
                                  "Please allow notifications in your browser settings"
                                );
                              }
                            } catch (error) {
                              console.log(error);
                              toast.error("Failed to enable notifications");
                            }
                          } else {
                            setNotificationsEnabled(false);
                            toast.success("Notifications disabled");
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-zinc-100/50 dark:bg-zinc-800/50 rounded-lg !p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col">
                        <span className="text-zinc-900 dark:text-zinc-200">
                          Sound
                        </span>
                        <p className="text-xs text-zinc-500 mt-1">
                          Play a sound when timer ends
                        </p>
                      </div>
                      <Checkbox
                        checked={soundEnabled}
                        onChange={() => {
                          setSoundEnabled(!soundEnabled);
                          toast.success(
                            !soundEnabled ? "Sound enabled" : "Sound disabled"
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon Bar - Draggable Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="flex flex-col gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-lg !p-2 border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl cursor-move"
      >
        <button
          onClick={() => toggleSection("notes")}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
            activeSection === "notes"
              ? "bg-primary/20 text-primary"
              : "bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          )}
          title="Notes"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>

        <button
          onClick={() => toggleSection("tasks")}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
            activeSection === "tasks"
              ? "bg-primary/20 text-primary"
              : "bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          )}
          title="Tasks"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <path d="M7 11h10" />
            <path d="M7 15h8" />
            <path d="M7 19h6" />
          </svg>
        </button>

        <button
          onClick={() => toggleSection("settings")}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
            activeSection === "settings"
              ? "bg-primary/20 text-primary"
              : "bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          )}
          title="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>

        <button
          onClick={toggleTheme}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
            "bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          )}
          title={
            theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
        >
          {theme === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
