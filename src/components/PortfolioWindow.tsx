"use client";

import { useState } from "react";
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

interface PortfolioWindowProps {
  window: Window;
}

export default function PortfolioWindow({ window }: PortfolioWindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    setActiveWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowStore();
  const [viewMode, setViewMode] = useState<"grid" | "list" | "columns">("grid");
  const [searchQuery, setSearchQuery] = useState("");

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
        className="w-full h-full bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
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
        <div className="flex-1 overflow-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {window.title}
          </h2>
          <p className="text-gray-600">
            Portfolio content for {window.title} will be displayed here.
          </p>
        </div>
      </motion.div>
    </Rnd>
  );
}
