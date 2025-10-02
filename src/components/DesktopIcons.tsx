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
  return (
    <motion.button
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center space-y-0.5 p-2 group pointer-events-auto"
    >
      <div className="w-20 h-20 flex items-center justify-center">
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
      </div>
      <span className="text-white text-sm font-bold text-center max-w-32 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        {label}
      </span>
    </motion.button>
  );
}

export default function DesktopIcons() {
  const { openWindow } = useWindowStore();

  const folders = [
    {
      label: "About Me",
      onClick: () =>
        openWindow({ title: "About Me", type: "finder", content: "about" }),
    },
    {
      label: "Entrepreneurship",
      onClick: () =>
        openWindow({
          title: "Entrepreneurship",
          type: "finder",
          content: "entrepreneurship",
        }),
    },
    {
      label: "Projects",
      onClick: () =>
        openWindow({ title: "Projects", type: "finder", content: "projects" }),
    },
    {
      label: "Essays",
      onClick: () =>
        openWindow({ title: "Essays", type: "finder", content: "essays" }),
    },
    {
      label: "Venture",
      onClick: () =>
        openWindow({ title: "Venture", type: "finder", content: "venture" }),
    },
    {
      label: "Research",
      onClick: () =>
        openWindow({ title: "Research", type: "finder", content: "research" }),
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute left-[8%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-8">
        {folders.map((folder, index) => (
          <DesktopIcon
            key={`folder-${index}`}
            icon={<div />}
            label={folder.label}
            onClick={folder.onClick}
            position={{ x: 0, y: 0 }}
          />
        ))}
      </div>
    </div>
  );
}
