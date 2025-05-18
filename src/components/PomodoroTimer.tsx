"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";

const PomodoroTimer = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(25 * 60); // 25 minutes in seconds
  const [breakMinutes, setBreakMinutes] = useState(5 * 60); // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(focusMinutes);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [progress, setProgress] = useState(100);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? breakMinutes : focusMinutes);
    setProgress(100);
  };

  const switchMode = () => {
    setIsBreak(!isBreak);
    setTimeLeft(!isBreak ? breakMinutes : focusMinutes);
    setIsRunning(false);
    setProgress(100);
  };

  const handleFocusTimeChange = (newTime: number) => {
    setFocusMinutes(newTime);
    if (!isBreak) {
      setTimeLeft(newTime);
      setProgress(100);
    }
  };

  const handleBreakTimeChange = (newTime: number) => {
    setBreakMinutes(newTime);
    if (isBreak) {
      setTimeLeft(newTime);
      setProgress(100);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        const totalTime = isBreak ? breakMinutes : focusMinutes;
        setProgress((timeLeft / totalTime) * 100);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);

      // Play notification sound
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});

      // Switch mode automatically and count session if focus time is complete
      if (!isBreak) {
        setSessions((prev) => prev + 1);
        setIsBreak(true);
        setTimeLeft(breakMinutes);
      } else {
        setIsBreak(false);
        setTimeLeft(focusMinutes);
      }

      setProgress(100);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, breakMinutes, focusMinutes]);

  // Calculate circle properties
  const radius = 120; // Radius of the circle
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 8; // Width of the progress ring
  const center = radius + strokeWidth; // Center point accounting for stroke width
  const size = (radius + strokeWidth) * 2; // Total SVG size

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center !p-6 ${
        mounted
          ? theme === "dark"
            ? "bg-gradient-to-br from-background via-zinc-900/50 to-secondary/20"
            : "bg-[linear-gradient(to_bottom_right,transparent,rgba(var(--primary),0.1),rgba(var(--secondary),0.2))] bg-fixed relative before:absolute before:inset-0 before:bg-[linear-gradient(transparent_49%,rgba(0,0,0,0.05)_50%,transparent_51%)] before:bg-[length:100%_8px] before:opacity-30 before:pointer-events-none"
          : "bg-gradient-to-br from-background to-secondary/20"
      }`}
    >
      <Sidebar
        focusTime={focusMinutes}
        breakTime={breakMinutes}
        onFocusTimeChange={handleFocusTimeChange}
        onBreakTimeChange={handleBreakTimeChange}
      />

      <Card className="w-full max-w-md border-primary/10 shadow-xl backdrop-blur-sm bg-card/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <CardHeader className="space-y-3 text-center pb-4 px-6 relative">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary/90 via-primary to-primary-foreground bg-clip-text text-transparent drop-shadow-sm">
            {isBreak ? "Break Time" : "Focus Time"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-16 pt-4 pb-8 px-6 flex flex-col items-center">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-primary/10"
              />
              {/* Progress circle */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress / 100)}
                className="text-primary transition-all duration-1000 ease-in-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-6xl font-bold text-primary ${
                  isRunning ? "animate-subtle-pulse" : ""
                }`}
              >
                {formatTime(timeLeft)}
              </span>
              {sessions > 0 && (
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary/50"
                  >
                    <path d="M18.364 5.636a9 9 0 0 1 0 12.728" />
                    <path d="M21.364 2.636a13.5 13.5 0 0 1 0 18.728" />
                  </svg>
                  {sessions} {sessions === 1 ? "session" : "sessions"}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full !p-6">
            <Button
              onClick={toggleTimer}
              variant={isRunning ? "destructive" : "default"}
              size="lg"
              className={`h-14 !rounded-sm text-base font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                isRunning
                  ? "bg-destructive/90 hover:bg-destructive text-destructive-foreground"
                  : "bg-zinc-800 hover:bg-zinc-700 text-primary-foreground"
              } shadow-[0_4px_10px_rgba(0,0,0,0.2)] backdrop-blur-sm`}
            >
              {isRunning ? (
                <div className="flex items-center gap-2">
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
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  Pause
                </div>
              ) : (
                <div className="flex items-center gap-2">
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
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Start
                </div>
              )}
            </Button>
            <Button
              onClick={resetTimer}
              variant="secondary"
              size="lg"
              className="h-14 !rounded-sm text-base font-medium bg-zinc-800/80 hover:bg-zinc-700 text-zinc-100 shadow-[0_4px_10px_rgba(0,0,0,0.2)] backdrop-blur-sm flex items-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95"
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
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset
            </Button>
            <Button
              onClick={switchMode}
              variant="outline"
              size="lg"
              className="h-14 !rounded-sm text-base font-medium bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-100 border-2 border-zinc-700 shadow-[0_4px_10px_rgba(0,0,0,0.2)] backdrop-blur-sm flex items-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {isBreak ? (
                <>
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
                  Focus
                </>
              ) : (
                <>
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
                    <path d="M18.364 5.636a9 9 0 0 1 0 12.728" />
                    <path d="M21.364 2.636a13.5 13.5 0 0 1 0 18.728" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  Break
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PomodoroTimer;
