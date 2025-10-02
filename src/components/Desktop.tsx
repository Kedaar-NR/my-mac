"use client";

import { useState } from "react";
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

  // Update time every second
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
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
