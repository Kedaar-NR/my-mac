"use client";

import { useEffect, useState } from "react";
import { useWindowStore } from "@/store/windowStore";
import MenuBar from "./MenuBar";
import DesktopIcons from "./DesktopIcons";
import Dock from "./Dock";
import FinderWindow from "./FinderWindow";
import MailWindow from "./MailWindow";
import PortfolioWindow from "./PortfolioWindow";

export default function Desktop() {
  const { windows } = useWindowStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  // Update time every second (client only)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const smallViewport =
        typeof window !== "undefined" && window.innerWidth < 900;
      const coarsePointer =
        typeof window !== "undefined" &&
        matchMedia("(pointer: coarse)").matches;
      setIsMobile(smallViewport || coarsePointer);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {isMobile && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-white text-black">
          <div className="text-center px-6">
            <div className="text-2xl font-semibold mb-2">
              Check my site on desktop!
            </div>
            <div className="text-sm opacity-70">
              This macOS experience is optimized for larger screens.
            </div>
          </div>
        </div>
      )}
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        aria-hidden="true"
        style={{
          backgroundImage: `url('/images/wallpaper.jpg')`,
          backgroundAttachment: "fixed",
        }}
      />

      {/* Menu Bar */}
      <MenuBar currentTime={currentTime} />

      {/* Desktop Icons */}
      <DesktopIcons />

      {/* Dock */}
      <Dock />

      {/* Windows */}
      {windows.map((window) => {
        if (!window.isOpen || window.isMinimized) return null;

        const commonProps = {
          window,
        };

        switch (window.type) {
          case "finder":
            return <FinderWindow key={window.id} {...commonProps} />;
          case "mail":
            return <MailWindow key={window.id} {...commonProps} />;
          case "portfolio":
            return <PortfolioWindow key={window.id} {...commonProps} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
