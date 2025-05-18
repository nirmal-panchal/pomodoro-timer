"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModeToggle } from "@/components/ModeToggle";

interface PomodoroSettingsProps {
  focusTime: number;
  breakTime: number;
  onFocusTimeChange: (value: number) => void;
  onBreakTimeChange: (value: number) => void;
}

export function PomodoroSettings({
  focusTime,
  breakTime,
  onFocusTimeChange,
  onBreakTimeChange,
}: PomodoroSettingsProps) {
  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="w-10 h-10 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-all"
            title="Timer Settings"
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
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-primary">
              Timer Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/80">
                Focus Time (minutes)
              </label>
              <div className="flex items-center justify-between bg-secondary/50 rounded-lg !p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 text-primary"
                  onClick={() => onFocusTimeChange(Math.max(5, focusTime - 5))}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                  </svg>
                </Button>
                <span className="text-lg font-semibold text-foreground min-w-[3ch] text-center">
                  {focusTime / 60}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 text-primary"
                  onClick={() => onFocusTimeChange(Math.min(60, focusTime + 5))}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/80">
                Break Time (minutes)
              </label>
              <div className="flex items-center justify-between bg-secondary/50 rounded-lg !p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 text-primary"
                  onClick={() => onBreakTimeChange(Math.max(1, breakTime - 1))}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                  </svg>
                </Button>
                <span className="text-lg font-semibold text-foreground min-w-[3ch] text-center">
                  {breakTime / 60}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 text-primary"
                  onClick={() => onBreakTimeChange(Math.min(30, breakTime + 1))}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ModeToggle />
    </div>
  );
}
