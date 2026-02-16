"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

export default function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      className="flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-colors duration-300 hover:border-neutral-300 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      type="button"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 dark:hidden"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a.75.75 0 0 0-.73.97A7 7 0 1 0 20.03 15a.75.75 0 0 0 .97-.5z" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="hidden h-4 w-4 dark:block"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 4.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V5.5A.75.75 0 0 1 12 4.75zm0 11a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5zm6.25-3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75zM4.75 12a.75.75 0 0 1 .75-.75H7a.75.75 0 0 1 0 1.5H5.5a.75.75 0 0 1-.75-.75zm11.03 5.28a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06zm-9.62 0a.75.75 0 0 1 1.06 0 .75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.06-1.06zm10.68-10.62a.75.75 0 0 1 1.06 0 .75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06zM6.22 6.66a.75.75 0 0 1 1.06 0L8.34 7.72A.75.75 0 1 1 7.28 8.78L6.22 7.72a.75.75 0 0 1 0-1.06z" />
      </svg>
    </button>
  );
}
