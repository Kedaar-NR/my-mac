"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useWindowStore } from "@/store/windowStore";

interface LaunchpadProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Launchpad({ isOpen, onClose }: LaunchpadProps) {
  const { openWindow } = useWindowStore();

  const apps = [
    {
      name: "Finder",
      icon: "/images/finder.jpeg",
      onClick: () => {
        openWindow({ title: "Finder", type: "finder", content: "finder-home" });
        onClose();
      },
    },
    {
      name: "Safari",
      icon: "/images/safari.jpeg",
      onClick: () => {
        openWindow({ title: "Safari", type: "safari", content: "browser" });
        onClose();
      },
    },
    {
      name: "Mail",
      icon: "/images/mail.jpeg",
      onClick: () => {
        if (typeof window !== "undefined") {
          window.location.href = "mailto:kedaarnr@berkeley.edu";
        }
        onClose();
      },
    },
    {
      name: "Messages",
      icon: "/images/messages.jpeg",
      onClick: () => {
        if (typeof window !== "undefined") {
          window.location.href = "sms:6506607341";
        }
        onClose();
      },
    },
    {
      name: "Spotify",
      icon: "/images/spotify.jpeg",
      onClick: () => {
        if (typeof window !== "undefined") {
          window.open("https://open.spotify.com/user/dnm1bxd8ubssltoz7dkczz2tt", "_blank");
        }
        onClose();
      },
    },
    {
      name: "TextEdit",
      icon: "/images/textedit.jpeg",
      onClick: () => {
        onClose();
      },
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Blurred background */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-xl" />

          {/* Launchpad panel */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/40 max-w-2xl w-full mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <h1 className="text-2xl font-medium text-gray-800">Apps</h1>
              </div>
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
              {apps.map((app) => (
                <motion.button
                  key={app.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={app.onClick}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 group-hover:shadow-xl transition-shadow">
                    <Image
                      src={app.icon}
                      alt={app.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-800">
                    {app.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
