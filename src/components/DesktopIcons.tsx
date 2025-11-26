"use client";

import { motion } from "framer-motion";
import { useWindowStore } from "@/store/windowStore";
interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  position: { x: number | string; y: number | string };
}

function DesktopIcon({ label, onClick }: DesktopIconProps) {
  const isTextFile = label.endsWith(".md") || label.endsWith(".txt");

  return (
    <motion.button
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center space-y-1 p-1.5 group pointer-events-auto select-none"
      aria-label={label}
    >
      <div
        className="relative w-20 h-20 flex items-center justify-center"
        aria-hidden="true"
      >
        {isTextFile ? (
          <svg
            width="80"
            height="80"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Text file page - white with slight shadow */}
            <path d="M14 6 L42 6 L52 16 L52 58 L14 58 Z" fill="#FFFFFF" />
            {/* Folded corner background */}
            <path d="M42 6 L42 16 L52 16 Z" fill="#E0E0E0" />
            {/* Page outline */}
            <path
              d="M14 6 L42 6 L52 16 L52 58 L14 58 Z M42 6 L42 16 L52 16"
              stroke="#000000"
              strokeWidth="0.5"
              fill="none"
            />
            {/* TXT label in center */}
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
        ) : (
          <svg
            width="80"
            height="80"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id={`folderGradient-${label.replace(/\s+/g, "")}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#6DB3E8", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#4A9CD9", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
            {/* Single folder */}
            <path
              d="M8 20 C8 18 9 17 11 17 L22 17 L25 20 L54 20 C56 20 57 21 57 23 L57 48 C57 50 56 51 54 51 L11 51 C9 51 8 50 8 48 Z"
              fill={`url(#folderGradient-${label.replace(/\s+/g, "")})`}
            />
            {/* Folder tab highlight */}
            <path
              d="M22 17 L25 20 L11 20 C9 20 8 19 8 17 L8 17 C8 17 9 17 11 17 Z"
              fill="#7FC4EF"
              opacity="0.6"
            />
          </svg>
        )}
        {/* Removed overlay glyphs per request */}
      </div>
      <span className="text-black text-sm font-bold text-center w-24 leading-tight drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)] -mt-1">
        {label}
      </span>
    </motion.button>
  );
}

export default function DesktopIcons() {
  const { openWindow } = useWindowStore();

  const open = (title: string, content: string) =>
    openWindow({ title, type: "finder", content });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Single column order per request */}
      <div className="absolute left-[8%] top-[50%] -translate-y-1/2 flex flex-col items-center gap-2">
        <DesktopIcon
          label="about_me.txt"
          onClick={() => open("about_me.txt", "about")}
          icon={<div />}
          position={{ x: 0, y: 0 }}
        />
        <DesktopIcon
          label="Entrepreneurship"
          onClick={() => open("Entrepreneurship", "entrepreneurship")}
          icon={<div />}
          position={{ x: 0, y: 0 }}
        />
        <DesktopIcon
          label="Research"
          onClick={() => open("Research", "research")}
          icon={<div />}
          position={{ x: 0, y: 0 }}
        />
        <DesktopIcon
          label="Jobs"
          onClick={() => open("Jobs", "work")}
          icon={<div />}
          position={{ x: 0, y: 0 }}
        />
        <DesktopIcon
          label="Projects"
          onClick={() => open("Projects", "projects")}
          icon={<div />}
          position={{ x: 0, y: 0 }}
        />
        <DesktopIcon
          label="Essays"
          onClick={() => open("Essays", "essays")}
          icon={<div />}
          position={{ x: 0, y: 0 }}
        />
      </div>
    </div>
  );
}
