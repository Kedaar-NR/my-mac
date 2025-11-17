"use client";

import { useRef, useState, useEffect } from "react";
import { useWindowStore, Window } from "@/store/windowStore";
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";

interface SafariWindowProps {
  window: Window;
}

interface Tab {
  id: string;
  title: string;
  url: string;
  type: "web" | "testimonials";
  favicon?: "forms" | "globe" | "google";
}

export default function SafariWindow({ window }: SafariWindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    updateWindowPosition,
    updateWindowSize,
    bringToFront,
    setActiveWindow,
  } = useWindowStore();

  const nodeRef = useRef<HTMLDivElement>(null);
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "tab-1", title: "Feedback Form", url: "https://forms.gle/aEitWhy1FVkmXXN2A", type: "web", favicon: "forms" },
    { id: "tab-2", title: "Testimonials", url: "https://forms.gle/agxTUX7YPMqyMJvG8", type: "testimonials", favicon: "globe" },
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-1");
  const [inputUrl, setInputUrl] = useState("forms.gle");
  const [isLoading, setIsLoading] = useState(true);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [activeTab?.url]);

  useEffect(() => {
    if (activeTab?.type === "web") {
      setInputUrl(activeTab.url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]);
    } else {
      setInputUrl("testimonials");
    }
  }, [activeTabId, activeTab]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab?.type !== "web") return;

    let finalUrl = inputUrl;
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      if (!finalUrl.includes(".") || finalUrl.includes(" ")) {
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}`;
      } else {
        finalUrl = `https://${finalUrl}`;
      }
    }
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, url: finalUrl } : t))
    );
    setInputUrl(finalUrl.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]);
    setIsLoading(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (activeTab?.type === "web") {
      const currentUrl = activeTab.url;
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, url: "" } : t))
      );
      setTimeout(() => {
        setTabs((prev) =>
          prev.map((t) => (t.id === activeTabId ? { ...t, url: currentUrl } : t))
        );
      }, 50);
    } else {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const closeTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const addNewTab = () => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      title: "New Tab",
      url: "https://www.google.com",
      type: "web",
      favicon: "google",
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const renderFavicon = (favicon?: string) => {
    switch (favicon) {
      case "forms":
        return (
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 48 48" fill="none">
            <path d="M12 6C9.79 6 8 7.79 8 10v28c0 2.21 1.79 4 4 4h24c2.21 0 4-1.79 4-4V10c0-2.21-1.79-4-4-4H12z" fill="#7248B9" />
            <rect x="14" y="12" width="20" height="4" rx="1" fill="white" />
            <rect x="14" y="20" width="20" height="4" rx="1" fill="white" />
            <rect x="14" y="28" width="14" height="4" rx="1" fill="white" />
          </svg>
        );
      case "globe":
        return (
          <span className="text-sm flex-shrink-0">🌍</span>
        );
      case "google":
        return (
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        );
      default:
        return (
          <div className="w-4 h-4 flex-shrink-0 bg-gray-500 rounded" />
        );
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      handle=".window-handle"
      position={{ x: window.x, y: window.y }}
      onStop={(_, data) => updateWindowPosition(window.id, data.x, data.y)}
      onStart={() => {
        bringToFront(window.id);
        setActiveWindow(window.id);
      }}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        style={{ zIndex: window.zIndex }}
        className="absolute"
        onMouseDown={() => {
          bringToFront(window.id);
          setActiveWindow(window.id);
        }}
      >
        <Resizable
          size={{ width: window.width, height: window.height }}
          onResizeStop={(_, __, ___, d) => {
            updateWindowSize(
              window.id,
              window.width + d.width,
              window.height + d.height
            );
          }}
          minWidth={700}
          minHeight={500}
          enable={{
            top: false,
            right: true,
            bottom: true,
            left: false,
            topRight: false,
            bottomRight: true,
            bottomLeft: false,
            topLeft: false,
          }}
        >
          <div className="bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden flex flex-col h-full border border-[#3d3d3d]">
            {/* Safari Toolbar - Dark theme matching macOS exactly */}
            <div className="window-handle bg-[#3d3d3d] px-3 py-2 flex items-center cursor-move border-b border-[#2a2a2a]">
              {/* Left section - Traffic lights and navigation */}
              <div className="flex items-center gap-3">
                {/* Traffic lights */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => closeWindow(window.id)}
                    className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] transition-colors flex items-center justify-center group"
                  >
                    <span className="text-[8px] text-black/60 opacity-0 group-hover:opacity-100 font-bold">
                      ×
                    </span>
                  </button>
                  <button
                    onClick={() => minimizeWindow(window.id)}
                    className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#ff9500] transition-colors flex items-center justify-center group"
                  >
                    <span className="text-[8px] text-black/60 opacity-0 group-hover:opacity-100 font-bold">
                      −
                    </span>
                  </button>
                  <button className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#34c759] transition-colors" />
                </div>

                {/* Sidebar toggle with dropdown */}
                <button className="flex items-center gap-0.5 p-1.5 rounded hover:bg-white/10 text-[#9a9a9a] transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                  <span className="text-[10px] font-medium leading-none">▾</span>
                </button>

                {/* Back button */}
                <button className="p-1.5 rounded hover:bg-white/10 text-[#6a6a6a] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Forward button */}
                <button className="p-1.5 rounded hover:bg-white/10 text-[#6a6a6a] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Globe/Earth icon */}
                <button className="p-1.5 rounded hover:bg-white/10 text-[#9a9a9a] transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </button>

                {/* Reader view icon */}
                <button className="p-1.5 rounded hover:bg-white/10 text-[#9a9a9a] transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="14" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Center section - URL Bar */}
              <div className="flex-1 mx-6">
                <form onSubmit={handleUrlSubmit} className="w-full max-w-xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="w-full bg-[#1e1e1e] text-[#ffffff] text-sm px-4 py-1 rounded-md border-none focus:outline-none focus:ring-1 focus:ring-[#0a84ff] text-center placeholder-[#6a6a6a]"
                      placeholder="Search or enter website name"
                      readOnly={activeTab?.type === "testimonials"}
                    />
                    {!isLoading && (
                      <button
                        type="button"
                        onClick={handleRefresh}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9a9a] hover:text-white"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                    {isLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 border-2 border-[#0a84ff] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Right section - Actions */}
              <div className="flex items-center gap-2">
                {/* Privacy/Shield with checkmark */}
                <button className="p-1.5 rounded hover:bg-white/10 text-[#9a9a9a] transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                  </svg>
                </button>

                {/* Share button */}
                <button className="p-1.5 rounded hover:bg-white/10 text-[#9a9a9a] transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                    <polyline points="16,6 12,2 8,6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </button>

                {/* New tab button */}
                <button
                  onClick={addNewTab}
                  className="p-1.5 rounded hover:bg-white/10 text-[#9a9a9a] transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>

                {/* Tab overview button - two overlapping squares */}
                <button className="p-1.5 rounded hover:bg-white/10 text-[#9a9a9a] transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="4" width="12" height="12" rx="2" />
                    <path d="M8 8h12a2 2 0 012 2v12a2 2 0 01-2 2H10" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tab Bar */}
            <div className="bg-[#2d2d2d] flex items-center px-2 py-1 gap-1 border-b border-[#1e1e1e]">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer max-w-[200px] ${
                    activeTabId === tab.id
                      ? "bg-[#4a4a4a]"
                      : "bg-transparent hover:bg-[#3a3a3a]"
                  }`}
                >
                  {renderFavicon(tab.favicon)}
                  <span className="text-xs text-[#e0e0e0] truncate flex-1">
                    {tab.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="text-[#9a9a9a] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={addNewTab}
                className="p-1 rounded hover:bg-[#3a3a3a] text-[#9a9a9a] transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {/* Browser content */}
            <div className="flex-1 bg-white relative overflow-hidden">
              {activeTab?.type === "web" && activeTab.url && (
                <iframe
                  src={activeTab.url}
                  className="w-full h-full border-none"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  title="Safari Browser"
                  onLoad={() => setIsLoading(false)}
                />
              )}
              {activeTab?.type === "testimonials" && (
                <div className="w-full h-full bg-black p-8 overflow-y-auto flex items-center justify-center">
                  <div className="w-full max-w-3xl">
                    {/* White thought bubble */}
                    <div className="relative">
                      <div className="bg-white rounded-[32px] p-8 min-h-[200px] shadow-2xl">
                        {/* Empty bubble - testimonials will be added here */}
                        <div className="text-center text-gray-400 py-8">
                          <p className="text-lg font-bold">No testimonials yet</p>
                          <p className="text-sm mt-2 font-medium">Approved submissions will appear here</p>
                        </div>
                      </div>
                      {/* Thought bubble tail */}
                      <div className="absolute -bottom-4 left-12">
                        <div className="w-6 h-6 bg-white rounded-full shadow-lg"></div>
                      </div>
                      <div className="absolute -bottom-8 left-8">
                        <div className="w-4 h-4 bg-white rounded-full shadow-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Resizable>
      </div>
    </Draggable>
  );
}
