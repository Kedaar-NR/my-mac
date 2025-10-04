"use client";

import { useEffect, useState } from "react";
import { useWindowStore } from "@/store/windowStore";
import MenuBar from "./MenuBar";
import DesktopIcons from "./DesktopIcons";
import Dock from "./Dock";
import FinderWindow from "./FinderWindow";
import MailWindow from "./MailWindow";
import PortfolioWindow from "./PortfolioWindow";
import { AILoader } from "./ui/ai-loader";

export default function Desktop() {
  const { windows } = useWindowStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Detect mobile on client side only
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 900 ||
        matchMedia("(pointer: coarse)").matches
      );
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show loader for 2.5 seconds on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Update time every second (client only) - only for desktop
  useEffect(() => {
    if (isMobile) return;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isMobile]);

  // Wait for client-side hydration to avoid mismatch
  if (!isClient) {
    return null;
  }

  // If mobile, show only the "Check on desktop!" message
  if (isMobile) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white text-black">
        <div className="text-center px-6">
          <div className="text-2xl font-normal tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            Check on desktop!
          </div>
        </div>
      </div>
    );
  }

  // Show loader on initial load (desktop only)
  if (isLoading) {
    return <AILoader />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden animate-[fade-in_0.7s_ease-out]">
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
