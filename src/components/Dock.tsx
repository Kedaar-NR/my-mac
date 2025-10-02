"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useWindowStore } from "@/store/windowStore";

interface DockIconProps {
  iconSrc?: string;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  isSeparator?: boolean;
  isFolder?: boolean;
  isMinimizedWindow?: boolean;
  windowId?: string;
}

function DockIcon({ iconSrc, label, onClick, isActive = false, isSeparator = false, isFolder = false, isMinimizedWindow = false, windowId }: DockIconProps) {
  const { restoreWindow } = useWindowStore();

  if (isSeparator) {
    return (
      <div className="w-0.5 h-16 bg-white/30 mx-2 rounded-full" />
    );
  }

  const handleClick = () => {
    if (isMinimizedWindow && windowId) {
      restoreWindow(windowId);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.15, y: -8 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      onClick={handleClick}
      className={`relative group flex flex-col items-center ${isMinimizedWindow ? 'cursor-pointer' : 'cursor-default'}`}
      title={label}
    >
      {isFolder ? (
        <div className="w-16 h-16 flex items-center justify-center relative">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={`folderGradient1-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#6DB3E8", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#4A9CD9", stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id={`folderGradient2-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#5BA5DC", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#3890CC", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            {/* Back folder */}
            <path d="M6 16 C6 14 7 13 9 13 L20 13 L23 16 L54 16 C56 16 57 17 57 19 L57 38 C57 40 56 41 54 41 L9 41 C7 41 6 40 6 38 Z" fill={`url(#folderGradient1-${label})`} opacity="0.5" />
            {/* Front folder */}
            <path d="M4 22 C4 20 5 19 7 19 L18 19 L21 22 L56 22 C58 22 59 23 59 25 L59 50 C59 52 58 53 56 53 L7 53 C5 53 4 52 4 50 Z" fill={`url(#folderGradient2-${label})`} />
            {/* Folder tab highlight */}
            <path d="M18 19 L21 22 L7 22 C5 22 4 21 4 19 L4 19 C4 19 5 19 7 19 Z" fill="#7FC4EF" opacity="0.6" />
          </svg>
        </div>
      ) : iconSrc ? (
        <div className="w-16 h-16 rounded-[22%] overflow-hidden shadow-2xl">
          <Image
            src={iconSrc}
            alt={label}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
      ) : null}
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white/80 rounded-full shadow-lg" />
      )}
    </motion.div>
  );
}

export default function Dock() {
  const { windows } = useWindowStore();

  const dockApps = [
    {
      iconSrc: "/images/finder.jpeg",
      label: "Finder",
      isActive: true,
    },
    {
      iconSrc: "/images/safari.jpeg",
      label: "Safari",
      isActive: true,
    },
    {
      iconSrc: "/images/spotify.jpeg",
      label: "Spotify",
      isActive: true,
    },
    {
      iconSrc: "/images/apple-music.jpeg",
      label: "Apple Music",
      isActive: true,
    },
    {
      iconSrc: "/images/music.jpeg",
      label: "Messages",
      isActive: true,
    },
    {
      iconSrc: "/images/launchpad.jpeg",
      label: "Launchpad",
      isActive: true,
    },
  ];

  const minimizedWindows = windows.filter(w => w.isMinimized && w.isOpen);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
    >
      <div className="bg-white/10 backdrop-blur-3xl rounded-[24px] px-3 py-3 shadow-2xl border border-white/20">
        <div className="flex items-end gap-2">
          {dockApps.map((app, index) => (
            <DockIcon key={index} {...app} />
          ))}
          <div className="w-0.5 h-16 bg-white/30 mx-2 rounded-full" />
          {minimizedWindows.map((window) => (
            <DockIcon
              key={window.id}
              label={window.title}
              isActive={true}
              isMinimizedWindow={true}
              windowId={window.id}
              isFolder={true}
            />
          ))}
          <DockIcon
            iconSrc="/images/trash.jpeg"
            label="Trash"
            isActive={false}
          />
        </div>
      </div>
    </motion.div>
  );
}
