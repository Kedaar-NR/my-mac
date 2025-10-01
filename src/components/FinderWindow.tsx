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

interface FinderWindowProps {
  window: Window;
}

export default function FinderWindow({ window }: FinderWindowProps) {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragStop = (e: any, d: { x: number; y: number }) => {
    updateWindowPosition(window.id, d.x, d.y);
  };

  const handleResizeStop = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    e: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    direction: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delta: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    position: any
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

  const getContent = () => {
    switch (window.content) {
      case "projects":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              My Projects
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">
                  E-commerce Platform
                </h3>
                <p className="text-sm text-blue-600">
                  Full-stack React/Node.js application
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">AI Chatbot</h3>
                <p className="text-sm text-green-600">
                  Machine learning powered assistant
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">Mobile App</h3>
                <p className="text-sm text-purple-600">
                  React Native cross-platform app
                </p>
              </div>
              <div className="bg-orange-100 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800">
                  Data Dashboard
                </h3>
                <p className="text-sm text-orange-600">
                  Real-time analytics visualization
                </p>
              </div>
            </div>
          </div>
        );
      case "essays":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Essays & Writing
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800">
                  The Future of Web Development
                </h3>
                <p className="text-sm text-gray-600">Published: March 2024</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800">
                  Building Scalable Systems
                </h3>
                <p className="text-sm text-gray-600">
                  Published: February 2024
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800">
                  AI and Human Creativity
                </h3>
                <p className="text-sm text-gray-600">Published: January 2024</p>
              </div>
            </div>
          </div>
        );
      case "venture":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Venture & Startup
            </h2>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-4">
              <h3 className="text-xl font-bold">Current Startup</h3>
              <p className="text-blue-100">
                Building the next generation of developer tools
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  Investment Portfolio
                </h3>
                <p className="text-sm text-gray-600">
                  Early-stage tech investments
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">Advisory Roles</h3>
                <p className="text-sm text-gray-600">
                  Strategic advisor for 3 startups
                </p>
              </div>
            </div>
          </div>
        );
      case "research":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Research & Publications
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">
                  Machine Learning in Healthcare
                </h3>
                <p className="text-sm text-blue-600">IEEE Conference 2024</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">
                  Quantum Computing Applications
                </h3>
                <p className="text-sm text-green-600">Nature Journal 2023</p>
              </div>
            </div>
          </div>
        );
      case "life":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Life</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-pink-100 p-4 rounded-lg">
                <h3 className="font-semibold text-pink-800">Travel</h3>
                <p className="text-sm text-pink-600">Visited 15 countries</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800">Hobbies</h3>
                <p className="text-sm text-yellow-600">
                  Photography, hiking, cooking
                </p>
              </div>
            </div>
          </div>
        );
      case "socials":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Social Links
            </h2>
            <div className="space-y-3">
              <a
                href="https://linkedin.com"
                className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-blue-800">LinkedIn</span>
              </a>
              <a
                href="https://github.com"
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">G</span>
                </div>
                <span className="text-gray-800">GitHub</span>
              </a>
              <a
                href="https://twitter.com"
                className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="text-blue-800">Twitter</span>
              </a>
            </div>
          </div>
        );
      case "trash":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Trash</h2>
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🗑️</span>
              </div>
              <p>Trash is empty</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {window.title}
            </h2>
            <p className="text-gray-600">
              Content for {window.title} will be displayed here.
            </p>
          </div>
        );
    }
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
        <div className="flex-1 overflow-auto">{getContent()}</div>
      </motion.div>
    </Rnd>
  );
}
