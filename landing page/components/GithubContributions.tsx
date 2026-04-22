"use client";

import { useState, useEffect } from "react";
import { Github, Flame, Info } from "lucide-react";
import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";

interface Day {
  date: string;
  count: number;
}

interface GithubData {
  total: number;
  streak: number;
  days: Day[];
}

export const GithubContributions = () => {
  const { resolvedTheme } = useTheme();
  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/github/contributions",
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error("Github API Error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to connect to local Github API",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getLevel = (count: number) => {
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 9) return 3;
    return 4;
  };

  const lightColors = [
    "var(--color-surface-2)",
    "rgba(143, 184, 36, 0.3)",
    "rgba(143, 184, 36, 0.5)",
    "rgba(143, 184, 36, 0.8)",
    "var(--color-accent)",
  ];

  const darkColors = [
    "var(--color-surface-2)",
    "rgba(200, 245, 66, 0.2)",
    "rgba(200, 245, 66, 0.4)",
    "rgba(200, 245, 66, 0.7)",
    "var(--color-accent)",
  ];

  if (!mounted) return null;

  // Prepare data for the calendar component
  const transformedDays = data?.days?.map((d) => ({
    date: d.date,
    count: d.count,
    level: getLevel(d.count) as 0 | 1 | 2 | 3 | 4,
  }));

  return (
    <section className="w-full bg-bg py-16 px-5 md:px-20 border-y border-dashed border-border">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-ink leading-tight flex items-center gap-4">
              <Github className="w-8 h-8 md:w-12 md:h-12" />
              CONTRIBUTIONS
            </h2>
          </div>

          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="font-label text-sm text-muted tracking-widest uppercase">
                Total
              </span>
              <span className="font-display text-2xl md:text-3xl font-bold text-accent">
                {loading ? "---" : data?.total || 0}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label text-sm text-muted tracking-widest uppercase">
                Streak
              </span>
              <span className="font-display text-2xl md:text-3xl font-bold text-accent-2 flex items-center gap-2">
                <Flame className="w-5 h-5" />
                {loading ? "---" : data?.streak || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Heatmap Area */}
        <div className="bg-surface border border-border p-6 md:p-8 rounded-sm relative overflow-hidden shadow-sm flex justify-center min-h-[200px] items-center [&_article]:![scrollbar-width:none] [&_article::-webkit-scrollbar]:!hidden">
          {loading ? (
            <div className="text-muted font-mono animate-pulse">
              [ SYNCING_COMMIT_HISTORY... ]
            </div>
          ) : error && !data ? (
            <div className="flex flex-col items-center justify-center text-red-500 font-mono text-center gap-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>CONNECTION_FAILED: {error}</span>
              </div>
              <span className="text-[10px] text-muted uppercase italic">
                Check local server at :5000
              </span>
            </div>
          ) : (
            <GitHubCalendar
              username="Priyankm23"
              data={transformedDays}
              year={2026}
              blockSize={14}
              blockMargin={6}
              colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
              showWeekdayLabels={true}
              theme={{
                dark: darkColors,
                light: lightColors,
              }}
            />
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted uppercase">
            <span className="w-2 h-2 bg-border opacity-30" />
            <span>Less</span>
            <div className="flex gap-1 mx-1">
              {(resolvedTheme === "light" ? lightColors : darkColors).map(
                (c, i) => (
                  <div key={i} className="w-2 h-2" style={{ background: c }} />
                ),
              )}
            </div>
            <span>More</span>
          </div>

          <div className="text-[10px] font-mono text-muted uppercase tracking-widest opacity-60">
            2026 Contribution Calendar
          </div>
        </div>
      </div>
    </section>
  );
};
