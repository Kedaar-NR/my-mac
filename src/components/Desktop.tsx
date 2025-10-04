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
  // Check mobile immediately during render
  const isMobile = typeof window !== "undefined" && (
    window.innerWidth < 900 || 
    matchMedia("(pointer: coarse)").matches
  );

  // Update time every second (client only) - only for desktop
  useEffect(() => {
    if (isMobile) return;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isMobile]);

  // If mobile, show only the "Check on desktop!" message immediately
  if (isMobile) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white text-black">
        <div className="text-center px-6">
          <div className="text-2xl font-semibold">Check on desktop!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
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
