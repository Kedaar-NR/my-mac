"use client";

import { useState, useEffect, useMemo } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Grid3X3,
  List,
  Columns,
  Sidebar,
  Eye,
  Share,
  Tag,
  MoreHorizontal,
} from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import { Window } from "@/store/windowStore";

const TYPING_TEXTS = [
  "hacker.",
  "autodidact.",
  "maker.",
  "designer.",
  "builder.",
  "problem solver.",
];

function TypingAnimation() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = TYPING_TEXTS[currentIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < currentFullText.length) {
            setCurrentText(currentFullText.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % TYPING_TEXTS.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting]);

  return (
    <span>
      I&apos;m a {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  private: boolean;
  languages_url: string;
  _languages?: string[];
}

interface FinderWindowProps {
  window: Window;
}

export default function FinderWindow({ window }: FinderWindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    setActiveWindow,
    updateWindowPosition,
    updateWindowSize,
    openOrFocusTab,
    closeTab,
    setActiveTab,
  } = useWindowStore();

  const [viewMode, setViewMode] = useState<"grid" | "list" | "columns">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [streaks, setStreaks] = useState({
    calories: 935,
    typing: 160,
    pushups: 366,
    commits: 100,
  });
  // Optional GitHub token to avoid rate limits (set NEXT_PUBLIC_GITHUB_TOKEN)
  const githubToken =
    typeof process !== "undefined"
      ? (process as unknown as { env?: Record<string, string | undefined> }).env
          ?.NEXT_PUBLIC_GITHUB_TOKEN
      : undefined;
  const ghHeaders = useMemo<HeadersInit>(
    () => ({
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
    }),
    [githubToken]
  );

  useEffect(() => {
    if (window.content === "projects") {
      setLoading(true);
      fetch(
        "https://api.github.com/users/kedaar-nr/repos?type=owner&sort=updated&per_page=100",
        { headers: ghHeaders, cache: "no-store" }
      )
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`GitHub ${res.status}`);
          }
          const data = (await res.json()) as GitHubRepo[];
          const publicRepos = (Array.isArray(data) ? data : []).filter(
            (repo) => !repo.private
          );
          // fetch top languages (up to 3) for each repo
          const reposWithLangs = await Promise.all(
            publicRepos.map(async (repo) => {
              try {
                const resp = await fetch(repo.languages_url, {
                  headers: ghHeaders,
                });
                const obj = (await resp.json()) as Record<string, number>;
                const top = Object.entries(obj as Record<string, number>)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([name]) => String(name));
                return { ...repo, _languages: top } as GitHubRepo;
              } catch {
                return {
                  ...repo,
                  _languages: repo.language ? [repo.language] : [],
                } as GitHubRepo;
              }
            })
          );
          setRepos(reposWithLangs);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setRepos([]);
        });
    }
  }, [window.content, reloadKey, ghHeaders]);

  // Daily-updating streaks stored in localStorage
  useEffect(() => {
    if (typeof globalThis === "undefined" || !("localStorage" in globalThis))
      return;
    try {
      const STORAGE_KEY = "kedaar_streaks_v1";
      const today = new Date();
      const todayUtc = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate()
        )
      );

      const raw = globalThis.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          calories: number;
          typing: number;
          pushups: number;
          commits: number;
          lastUpdated: string;
        };
        const prev = new Date(parsed.lastUpdated);
        const prevUtc = new Date(
          Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth(), prev.getUTCDate())
        );
        const diffMs = todayUtc.getTime() - prevUtc.getTime();
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffDays > 0) {
          const updated = {
            calories: parsed.calories + diffDays,
            typing: parsed.typing + diffDays,
            pushups: parsed.pushups + diffDays,
            commits: parsed.commits + diffDays,
            lastUpdated: todayUtc.toISOString(),
          };
          setStreaks(updated);
          globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } else {
          setStreaks({
            calories: parsed.calories,
            typing: parsed.typing,
            pushups: parsed.pushups,
            commits: parsed.commits,
          });
        }
      } else {
        const initial = {
          calories: 935,
          typing: 160,
          pushups: 366,
          commits: 100,
          lastUpdated: todayUtc.toISOString(),
        };
        setStreaks(initial);
        globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Tabs are created only when clicking items; no auto-creation on load

  // Ensure Projects window opens taller
  useEffect(() => {
    if (window.content === "projects") {
      const desiredHeight = 720;
      if (window.height < desiredHeight) {
        updateWindowSize(window.id, window.width, desiredHeight);
      }
    }
  }, [
    window.content,
    window.height,
    window.id,
    window.width,
    updateWindowSize,
  ]);

  const handleDragStop = (_e: unknown, d: { x: number; y: number }) => {
    updateWindowPosition(window.id, d.x, d.y);
  };

  const handleResizeStop = (
    _e: unknown,
    _direction: unknown,
    ref: { style: { width: string; height: string } },
    _delta: unknown,
    position: { x: number; y: number }
  ) => {
    updateWindowSize(
      window.id,
      parseInt(ref.style.width),
      parseInt(ref.style.height)
    );
    updateWindowPosition(window.id, position.x, position.y);
  };

  const handleWindowClick = () => {
    setActiveWindow(window.id);
  };

  // Define types outside
  type ItemKind = "txt" | "folder";
  type Item = {
    name: string;
    key: string;
    kind: ItemKind;
    date?: string;
    size?: string;
    kindLabel?: string; // override text for Kind column
    languages?: string[]; // for projects list view
  };

  // Language badge coloring for Projects list view
  const langColorClass = (lang: string): string => {
    const L = (lang || "").toLowerCase();
    if (L === "typescript") return "bg-blue-50 text-blue-700 border-blue-200";
    if (L === "javascript")
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (L === "python") return "bg-green-50 text-green-700 border-green-200";
    if (L === "go") return "bg-cyan-50 text-cyan-700 border-cyan-200";
    if (L === "rust") return "bg-orange-50 text-orange-700 border-orange-200";
    if (L === "java") return "bg-red-50 text-red-700 border-red-200";
    if (L === "c++" || L === "cpp")
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (L === "c") return "bg-slate-50 text-slate-700 border-slate-200";
    if (L === "shell") return "bg-gray-50 text-gray-700 border-gray-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  // Define icon components outside to prevent re-creation
  const TxtIcon = () => (
    <svg
      width="80"
      height="80"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14 6 L42 6 L52 16 L52 58 L14 58 Z" fill="#FFFFFF" />
      <path d="M42 6 L42 16 L52 16 Z" fill="#E0E0E0" />
      <path
        d="M14 6 L42 6 L52 16 L52 58 L14 58 Z M42 6 L42 16 L52 16"
        stroke="#000000"
        strokeWidth="0.5"
        fill="none"
      />
      <text
        x="33"
        y="36"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="10"
        fontWeight="600"
        fill="#8E8E93"
        textAnchor="middle"
      >
        TXT
      </text>
    </svg>
  );

  const RepoBlockIcon = () => (
    <svg
      width="80"
      height="80"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="10"
        y="12"
        width="44"
        height="40"
        rx="6"
        fill="#F6F8FA"
        stroke="#D0D7DE"
      />
      <rect
        x="16"
        y="18"
        width="20"
        height="8"
        rx="2"
        fill="#96A0AA"
        opacity="0.6"
      />
      <rect x="38" y="18" width="10" height="8" rx="2" fill="#C8CDD2" />
      <rect x="16" y="30" width="36" height="4" rx="2" fill="#E3E6E9" />
      <rect x="16" y="38" width="28" height="4" rx="2" fill="#E3E6E9" />
    </svg>
  );

  const FolderIcon = () => (
    <svg
      width="80"
      height="80"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 20 C8 18 9 17 11 17 L22 17 L25 20 L54 20 C56 20 57 21 57 23 L57 48 C57 50 56 51 54 51 L11 51 C9 51 8 50 8 48 Z"
        fill="#6DB3E8"
      />
    </svg>
  );

  const renderItems = (_heading: string, items: Item[]) => {
    // De-duplicate any accidental repeats by key while toggling views
    const seenKeys = new Set<string>();
    const rows = items.filter((it) => {
      if (seenKeys.has(it.key)) return false;
      seenKeys.add(it.key);
      return true;
    });
    const openItem = (it: Item) => {
      // If it's a URL (GitHub link), open in new tab
      if (it.key.startsWith("http")) {
        if (typeof globalThis !== "undefined" && globalThis.window) {
          globalThis.window.open(it.key, "_blank", "noopener,noreferrer");
        }
      } else {
        // Open or focus a tab within this window
        openOrFocusTab(window.id, it.name, it.key);
      }
    };

    const getItemEmoji = (name: string) => {
      const lower = name.toLowerCase();
      if (lower.includes("fashion")) return "👔";
      if (lower.includes("omni")) return "🎨";
      if (lower.includes("v11")) return "💰";
      if (lower.includes("nfx")) return "📈";
      if (lower.includes("soma")) return "🚀";
      if (lower.includes("bair")) return "🤖";
      if (lower.includes("stanford")) return "🎓";
      if (lower.includes("macalester")) return "📚";
      if (lower.includes("magic")) return "✨";
      if (lower.includes("cisco")) return "🌐";
      return "";
    };

    const getRepoEmoji = (name: string) => {
      const lower = name.toLowerCase();
      if (lower.includes("telemed") || lower.includes("telemedicine"))
        return "🏥";
      if (
        lower.includes("sport") ||
        lower.includes("nba") ||
        lower.includes("mlb")
      )
        return "🏀";
      if (lower.includes("query") || lower.includes("search")) return "🔎";
      if (lower.includes("rank") || lower.includes("highlight")) return "📊";
      if (lower.includes("civic")) return "🏛️";
      if (lower.includes("converter")) return "🔁";
      if (lower.includes("echo")) return "🔊";
      if (lower.includes("mac") || lower === "my-mac") return "💻";
      if (lower.includes("cal") || lower.includes("hacks")) return "🧩";
      return "📁";
    };

    if (viewMode === "list") {
      // Special list layout for Projects: Name | Date Modified | Languages
      if (_heading === "Projects") {
        return (
          <div className="p-0">
            <div className="flex flex-col">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 border-y border-gray-200 text-xs text-gray-600 font-medium">
                <div className="col-span-4">Name</div>
                <div className="col-span-3">Date Modified</div>
                <div className="col-span-5">Languages</div>
              </div>
              {rows.map((it) => {
                // Do not use folder overlay emojis in Projects list; use repoEmoji only
                const emoji = "";
                const repoEmoji = getRepoEmoji(it.name);
                return (
                  <div
                    key={it.key}
                    className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-blue-50 text-sm text-left border-b border-gray-100"
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="relative w-5 h-5 flex-shrink-0">
                        {/* file icon for repos */}
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 2C3.47 2 2.96 2.21 2.59 2.59C2.21 2.96 2 3.47 2 4V16C2 16.53 2.21 17.04 2.59 17.41C2.96 17.79 3.47 18 4 18H16C16.53 18 17.04 17.79 17.41 17.41C17.79 17.04 18 16.53 18 16V7.41C18 7.01 17.84 6.63 17.56 6.35L12.65 1.44C12.37 1.16 11.99 1 11.59 1H4Z"
                            fill="#E8E8E8"
                          />
                          <path
                            d="M12 1V6C12 6.27 12.11 6.52 12.29 6.71C12.48 6.89 12.73 7 13 7H18"
                            fill="#A0A0A0"
                          />
                        </svg>
                        {emoji && (
                          <span className="absolute inset-0 flex items-center justify-center text-[10px]">
                            {emoji}
                          </span>
                        )}
                      </div>
                      <span className="text-base" aria-hidden>
                        {repoEmoji}
                      </span>
                      <a
                        href={it.key}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 group-hover:underline cursor-pointer"
                      >
                        {it.name}
                      </a>
                    </div>
                    <div className="col-span-3 text-gray-600">
                      {it.date || "—"}
                    </div>
                    <div className="col-span-5 flex items-center gap-2 flex-wrap">
                      {(it.languages ?? []).map((lang) => (
                        <span
                          key={lang}
                          className={
                            "px-2 py-0.5 text-xs rounded-full border " +
                            langColorClass(lang)
                          }
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
      return (
        <div className="p-0">
          <div className="flex flex-col">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 border-y border-gray-200 text-xs text-gray-600 font-medium">
              <div className="col-span-5">Name</div>
              <div className="col-span-3">Date Modified</div>
              <div className="col-span-2">Kind</div>
            </div>
            {rows.map((it) => {
              const emoji = getItemEmoji(it.name);
              return (
                <button
                  key={it.key}
                  onClick={() => openItem(it)}
                  className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-blue-50 text-sm text-left border-b border-gray-100"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="relative w-5 h-5 flex-shrink-0">
                      {it.kind === "txt" ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 2C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V16C2 16.5304 2.21071 17.0391 2.58579 17.4142C2.96086 17.7893 3.46957 18 4 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V7.414C18 7.01478 17.842 6.63206 17.5607 6.35074L12.6493 1.43934C12.3679 1.15804 11.9852 1 11.586 1H4Z"
                            fill="#E8E8E8"
                          />
                          <path
                            d="M12 1V6C12 6.26522 12.1054 6.51957 12.2929 6.70711C12.4804 6.89464 12.7348 7 13 7H18"
                            fill="#A0A0A0"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 5 C2 4 2.5 3.5 3.5 3.5 L7 3.5 L8 5 L16.5 5 C17.5 5 18 5.5 18 6.5 L18 15 C18 16 17.5 16.5 16.5 16.5 L3.5 16.5 C2.5 16.5 2 16 2 15 Z"
                            fill="#6DB3E8"
                          />
                        </svg>
                      )}
                      {emoji && (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px]">
                          {emoji}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-800">{it.name}</span>
                  </div>
                  <div className="col-span-3 text-gray-600">
                    {it.date || "—"}
                  </div>
                  <div className="col-span-2 text-gray-600">
                    {it.kindLabel ?? (it.kind === "txt" ? "Text" : "Folder")}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // grid view
    return (
      <div className="p-6">
        <div className="grid grid-cols-4 gap-8">
          {rows.map((it) => {
            const emoji = getItemEmoji(it.name);
            return (
              <button
                key={it.key}
                onClick={() => openItem(it)}
                className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="relative w-24 h-24 flex items-center justify-center">
                  {_heading === "Projects" ? (
                    <RepoBlockIcon />
                  ) : it.kind === "txt" ? (
                    <TxtIcon />
                  ) : (
                    <>
                      <FolderIcon />
                      {emoji && (
                        <span className="absolute inset-0 flex items-center justify-center text-2xl mt-1">
                          {emoji}
                        </span>
                      )}
                    </>
                  )}
                </div>
                <span className="text-gray-800 text-sm font-semibold text-center">
                  {it.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const activeContent = (() => {
    if (window.type === "finder" && window.tabs && window.activeTabId) {
      const t = window.tabs.find((t) => t.id === window.activeTabId);
      if (t) return t.content;
    }
    return window.content;
  })();

  const getContent = () => {
    const contentKey = activeContent;
    switch (contentKey) {
      case "about":
        return (
          <div className="p-8 bg-white text-black font-mono min-h-full overflow-auto">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold mb-6">Kedaar Rentachintala</h1>
              <div className="text-2xl text-green-600 mb-10">
                <TypingAnimation />
              </div>

              <div className="flex items-center justify-center space-x-12 mb-10">
                <a
                  href="https://linkedin.com/in/kedaarr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-black hover:text-green-600 transition-colors text-lg"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <span className="font-semibold">Linkedin</span>
                </a>
                <a
                  href="https://github.com/kedaar-nr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-black hover:text-green-600 transition-colors text-lg"
                >
                  <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <span className="font-semibold">GitHub</span>
                </a>
                <a
                  href="https://twitter.com/@kedaarnr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-black hover:text-green-600 transition-colors text-lg"
                >
                  <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </div>
                  <span className="font-semibold">Twitter</span>
                </a>
              </div>

              <div className="text-center mb-10">
                <a
                  href="mailto:kedaarnr@berkeley.edu"
                  className="text-lg text-gray-700 hover:text-green-600 transition-colors"
                >
                  kedaarnr@berkeley.edu
                </a>
              </div>

              <div className="border-t border-gray-300 pt-8 mb-8">
                <p className="text-lg mb-3">
                  I study EECS & Business at{" "}
                  <a
                    href="https://met.berkeley.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    UC Berkeley M.E.T.
                  </a>
                </p>
                <p className="text-lg mb-10">
                  Passionate about building high-impact AI systems.
                </p>

                <div className="text-xl font-bold mb-6">
                  what I care about these days:
                </div>
                <ul className="space-y-3 mb-10 text-lg list-none">
                  <li>exploring practical, high-impact applications of AI</li>
                  <li>
                    mentoring, collaborating, and leading student initiatives
                  </li>
                  <li>lifting, writing, building</li>
                </ul>

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold bg-yellow-200 inline-block px-6 py-2 rounded-lg">
                    🔥 Streaks!
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-sans">
                      🍎 tracking calories
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {streaks.calories} days
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-sans">
                      ⌨️ typing
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {streaks.typing} days
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-sans">
                      💪 100 pushups every day
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {streaks.pushups} days
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-sans">
                      💻 github commits
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {streaks.commits} days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "projects":
        if (loading) {
          return (
            <div className="p-8 bg-white text-black font-mono min-h-full">
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-gray-700 text-center">
                  Loading repositories...
                </p>
              </div>
            </div>
          );
        }
        if (!loading && repos.length === 0) {
          // Fallback static list so the view is never empty
          const staticRepoNames = [
            "my-mac",
            "echoes",
            "gita-query",
            "telemedicine",
            "sportspedia",
            "mlbbots",
            "highlight-detector",
            "Kedaar-NR",
            "fashion-week-mobile",
            "new-civic",
            "converter",
            "isadev",
            "repo-rank",
            "gordon-master",
            "Cal-Hacks",
            "GTC",
            "fashion-week",
          ];
          return renderItems(
            "Projects",
            staticRepoNames.map((name) => {
              const lower = name.toLowerCase();
              let languages: string[];
              if (
                lower.includes("ml") ||
                lower.includes("ai") ||
                lower.includes("bot") ||
                lower.includes("rank")
              ) {
                languages = ["Python"];
              } else if (
                lower.includes("mac") ||
                lower.includes("civic") ||
                lower.includes("query") ||
                lower.includes("hacks") ||
                lower.includes("week")
              ) {
                languages = ["TypeScript"];
              } else {
                languages = ["TypeScript", "Python"];
              }
              return {
                name,
                key: `https://github.com/kedaar-nr/${name}`,
                kind: "txt" as const,
                date: "Sep 2025",
                kindLabel: languages.join(", "),
                languages,
              };
            })
          );
        }
        if (!loading && repos.length === 0) {
          return (
            <div className="p-8 bg-white text-black min-h-full">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-gray-700 mb-4">
                  Unable to load repositories. This can happen due to GitHub
                  rate limits.
                </p>
                <button
                  onClick={() => setReloadKey((k) => k + 1)}
                  className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            </div>
          );
        }
        return renderItems(
          "Projects",
          repos.map((repo) => ({
            name: repo.name,
            key: repo.html_url,
            kind: "txt" as const,
            date: new Date(repo.updated_at).toLocaleDateString(),
            size: repo.stargazers_count ? `${repo.stargazers_count}★` : "",
            kindLabel: repo.language || "—",
          }))
        );
      case "work":
        return renderItems("Work", [
          {
            name: "MagicHour.txt",
            key: "magichour-txt",
            kind: "txt",
            date: "Apr 20, 2024",
            size: "5 KB",
          },
          {
            name: "Cisco.txt",
            key: "cisco-txt",
            kind: "txt",
            date: "May 12, 2024",
            size: "3 KB",
          },
          {
            name: "Techstars.txt",
            key: "techstars-txt",
            kind: "txt",
            date: "Jan 15, 2025",
            size: "4 KB",
          },
          {
            name: "StanfordHealthCare.txt",
            key: "stanford-healthcare-txt",
            kind: "txt",
            date: "Jun 01, 2025",
            size: "7 KB",
          },
          {
            name: "VariousCompanies.txt",
            key: "various-companies-txt",
            kind: "txt",
            date: "Sep 01, 2023",
            size: "6 KB",
          },
        ]);
            name: "StanfordHealthCare.txt",
            key: "stanford-healthcare-txt",
            kind: "txt",
            date: "Jun 01, 2025",
            size: "7 KB",
          },
        ]);
            name: "StanfordHealthCare.txt",
            key: "stanford-healthcare-txt",
            kind: "txt",
            date: "Jun 01, 2025",
            size: "7 KB",
          },
          {
            name: "Techstars.txt",
            key: "techstars-txt",
            kind: "txt",
            date: "Jan 15, 2025",
            size: "4 KB",
          },
          {
            name: "VariousCompanies.txt",
            key: "various-companies-txt",
            kind: "txt",
            date: "Sep 01, 2023",
            size: "6 KB",
          },
        ]);
      case "entrepreneurship":
        return renderItems("Entrepreneurship", [
          {
            name: "FashionWeek.txt",
            key: "fashionweek-txt",
            kind: "txt",
            date: "Jan 18, 2024",
            size: "6 KB",
          },
          {
            name: "OmniCreate.txt",
            key: "omnicreate-txt",
            kind: "txt",
            date: "Feb 25, 2024",
            size: "8 KB",
          },
        ]);
      case "venture":
        return renderItems("Venture", [
          {
            name: "V11.txt",
            key: "v11-txt",
            kind: "txt",
            date: "Mar 22, 2024",
            size: "4 KB",
          },
          {
            name: "NFX.txt",
            key: "nfx-txt",
            kind: "txt",
            date: "Apr 05, 2024",
            size: "7 KB",
          },
          {
            name: "SomaCapital.txt",
            key: "soma-capital-txt",
            kind: "txt",
            date: "May 08, 2024",
            size: "5 KB",
          },
        ]);
      case "research":
        return renderItems("Research", [
          {
            name: "BAIR.txt",
            key: "bair-txt",
            kind: "txt",
            date: "Feb 14, 2024",
            size: "9 KB",
          },
          {
            name: "Stanford.txt",
            key: "stanford-txt",
            kind: "txt",
            date: "Mar 10, 2024",
            size: "11 KB",
          },
          {
            name: "Macalester.txt",
            key: "macalester-txt",
            kind: "txt",
            date: "Apr 17, 2024",
            size: "6 KB",
          },
        ]);
      case "essays":
        return renderItems("Essays", [
          {
            name: "web_dev.md",
            key: "markdown-placeholder",
            kind: "txt",
            date: "Mar 15, 2024",
            size: "12 KB",
          },
          {
            name: "systems.md",
            key: "markdown-placeholder",
            kind: "txt",
            date: "Feb 28, 2024",
            size: "8 KB",
          },
        ]);
      case "markdown-placeholder":
        return (
          <div className="p-8 bg-white text-black font-mono min-h-full">
            <div className="max-w-3xl">
              <p className="text-lg text-gray-700">
                I&apos;ll post some of my essays and what I&apos;ve been
                thinking soon!
              </p>
            </div>
          </div>
        );
      case "fashionweek-txt":
        return (
          <div className="p-6 bg-white text-black font-sans min-h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              FashionWeek.txt
            </h2>
            <p className="text-gray-700">Content coming soon...</p>
          </div>
        );
      case "omnicreate-txt":
        return (
          <div className="p-6 bg-white text-black font-sans min-h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              OmniCreate.txt
            </h2>
            <p className="text-gray-700">Content coming soon...</p>
          </div>
        );
      case "magichour-txt":
        return (
          <div className="p-6 bg-white text-black font-sans min-h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              MagicHour.txt
            </h2>
            <p className="text-gray-700">Content coming soon...</p>
          </div>
        );
      case "cisco-txt":
        return (
          <div className="p-6 bg-white text-black font-sans min-h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cisco.txt</h2>
            <p className="text-gray-700">Content coming soon...</p>
          </div>
        );
      case "v11-txt":
        return (
          <div className="p-6 bg-white text-black font-sans min-h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">V11.txt</h2>
            <p className="text-gray-700">Content coming soon...</p>
          </div>
        );
      case "nfx-txt":
        return (
          <div className="p-6 bg-white text-black font-sans min-h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">NFX.txt</h2>
            <p className="text-gray-700">Content coming soon...</p>
          </div>
        );
      case "soma-capital-txt":
        return (
          <div className="p-6 bg-white text-black font-sans min-h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              SomaCapital.txt
            </h2>
            <p className="text-gray-700">Content coming soon...</p>
          </div>
        );
      case "bair-txt":
        return (
          <div className="p-6 bg-white text-black font-sans min-h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">BAIR.txt</h2>
            <p className="text-gray-700">Content coming soon...</p>
          </div>
        );
      case "stanford-txt":
        return (
          <div className="p-6 bg-white text-black font-sans min-h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Stanford.txt
            </h2>
            <p className="text-gray-700">Content coming soon...</p>
          </div>
        );
      case "macalester-txt":
        return (
          <div className="p-6 bg-white text-black font-sans min-h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Macalester.txt
            </h2>
            <p className="text-gray-700">Content coming soon...</p>
          </div>
        );
      case "life":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Life</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-pink-100 p-4 rounded-lg">
                <h3 className="font-semibold text-pink-800">Travel</h3>
                <p className="text-sm text-pink-600">Visited 15 countries</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800">Hobbies</h3>
                <p className="text-sm text-yellow-600">
                  Photography, hiking, cooking
                </p>
              </div>
            </div>
          </div>
        );
      case "socials":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Social Links
            </h2>
            <div className="space-y-3">
              <a
                href="https://linkedin.com"
                className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-blue-800">LinkedIn</span>
              </a>
              <a
                href="https://github.com"
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">G</span>
                </div>
                <span className="text-gray-800">GitHub</span>
              </a>
              <a
                href="https://twitter.com"
                className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="text-blue-800">Twitter</span>
              </a>
            </div>
          </div>
        );
      case "trash":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Trash</h2>
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🗑️</span>
              </div>
              <p>Trash is empty</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {(window.tabs ?? []).find((t) => t.id === window.activeTabId)
                ?.title || window.title}
            </h2>
            <p className="text-gray-600">
              Content for{" "}
              {(window.tabs ?? []).find((t) => t.id === window.activeTabId)
                ?.title || window.title}{" "}
              will be displayed here.
            </p>
          </div>
        );
    }
  };

  return (
    <Rnd
      size={{ width: window.width, height: window.height }}
      position={{ x: window.x, y: window.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onClick={handleWindowClick}
      className="absolute"
      style={{ zIndex: window.zIndex }}
      bounds="parent"
      minWidth={400}
      minHeight={300}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full h-full bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
      >
        {/* Title Bar */}
        <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => closeWindow(window.id)}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            />
            <button
              onClick={() => minimizeWindow(window.id)}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
            />
            <button
              onClick={() => maximizeWindow(window.id)}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
            />
          </div>
          <div className="text-sm font-medium text-gray-700">
            {window.title}
          </div>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        {/* Tab Bar */}
        {window.type === "finder" && (window.tabs ?? []).length > 0 && (
          <div className="h-9 bg-gray-50 border-b border-gray-200 flex items-center px-2 overflow-x-auto">
            <div className="flex items-center gap-1">
              {(window.tabs ?? []).map((t) => (
                <div
                  key={t.id}
                  className={`flex items-center max-w-xs pl-3 pr-2 h-7 rounded-md border text-xs cursor-pointer select-none ${
                    window.activeTabId === t.id
                      ? "bg-white border-gray-300 shadow-sm"
                      : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab(window.id, t.id)}
                  title={t.title}
                >
                  <span className="truncate mr-2">{t.title}</span>
                  <button
                    className="w-4 h-4 flex items-center justify-center rounded hover:bg-gray-300/60"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(window.id, t.id);
                    }}
                    aria-label="Close Tab"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-200 rounded">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <ChevronRight size={16} />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-200"
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 rounded ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-200"
                }`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode("columns")}
                className={`p-1 rounded ${
                  viewMode === "columns"
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-200"
                }`}
              >
                <Columns size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-1">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 outline-none text-sm"
              />
            </div>
            <button className="p-1 hover:bg-gray-200 rounded">
              <Sidebar size={16} />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <Eye size={16} />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <Share size={16} />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <Tag size={16} />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto h-full">{getContent()}</div>
      </motion.div>
    </Rnd>
  );
}
