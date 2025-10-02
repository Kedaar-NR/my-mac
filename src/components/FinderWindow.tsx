"use client";

import { useState, useEffect } from "react";
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

const TYPING_TEXTS = [
  "hacker.",
  "autodidact.",
  "maker.",
  "designer.",
  "builder.",
  "problem solver.",
];

function TypingAnimation() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = TYPING_TEXTS[currentIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < currentFullText.length) {
            setCurrentText(currentFullText.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % TYPING_TEXTS.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting]);

  return (
    <span>
      I&apos;m a {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

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
    openWindow,
  } = useWindowStore();
  const [viewMode, setViewMode] = useState<"grid" | "list" | "columns">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFileClick = (fileName: string) => {
    openWindow({
      title: fileName,
      type: "finder",
      content: "markdown-placeholder",
    });
    // Force the new window to come to front after a brief delay
    setTimeout(() => {
      const windows = useWindowStore.getState().windows;
      const newestWindow = windows[windows.length - 1];
      if (newestWindow) {
        useWindowStore.getState().setActiveWindow(newestWindow.id);
      }
    }, 10);
  };

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
      case "about":
        return (
          <div className="p-8 bg-white text-black font-mono min-h-full overflow-auto">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold mb-6">Kedaar Rentachintala</h1>
              <div className="text-2xl text-green-600 mb-10">
                <TypingAnimation />
              </div>

              <div className="flex items-center justify-center space-x-12 mb-10">
                <a
                  href="https://linkedin.com/in/kedaarr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-black hover:text-green-600 transition-colors text-lg"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <span className="font-semibold">Linkedin</span>
                </a>
                <a
                  href="https://github.com/kedaar-nr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-black hover:text-green-600 transition-colors text-lg"
                >
                  <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <span className="font-semibold">GitHub</span>
                </a>
                <a
                  href="https://twitter.com/@kedaarnr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-black hover:text-green-600 transition-colors text-lg"
                >
                  <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </div>
                  <span className="font-semibold">Twitter</span>
                </a>
              </div>

              <div className="text-center mb-10">
                <a
                  href="mailto:kedaarnr@berkeley.edu"
                  className="text-lg text-gray-700 hover:text-green-600 transition-colors"
                >
                  kedaarnr@berkeley.edu
                </a>
              </div>

              <div className="border-t border-gray-300 pt-8 mb-8">
                <p className="text-lg mb-3">
                  I study EECS & Business at{" "}
                  <a
                    href="https://met.berkeley.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    UC Berkeley M.E.T.
                  </a>
                </p>
                <p className="text-lg mb-10">Passionate about building high-impact AI systems.</p>

                <div className="text-xl font-bold mb-6">what I care about these days:</div>
                <ul className="space-y-3 mb-10 text-lg list-none">
                  <li>exploring practical, high-impact applications of AI</li>
                  <li>mentoring, collaborating, and leading student initiatives</li>
                  <li>lifting, writing, building</li>
                </ul>

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold bg-yellow-200 inline-block px-6 py-2 rounded-lg">🔥 Streaks!</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-sans">🍎 tracking calories</div>
                    <div className="text-3xl font-bold text-green-600">935 days</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-sans">⌨️ typing</div>
                    <div className="text-3xl font-bold text-green-600">160 days</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-sans">💪 100 pushups every day</div>
                    <div className="text-3xl font-bold text-green-600">366 days</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-sans">💻 github commits</div>
                    <div className="text-3xl font-bold text-green-600">100 days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
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
          <div className="p-0">
            <div className="flex flex-col">
              {/* File list header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-600 font-medium">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Date Modified</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-2">Kind</div>
              </div>

              {/* File rows */}
              <div className="divide-y divide-gray-100">
                <div
                  onClick={() => handleFileClick("web_dev.md")}
                  className="grid grid-cols-12 gap-4 px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <div className="col-span-6 flex items-center space-x-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 2C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V16C2 16.5304 2.21071 17.0391 2.58579 17.4142C2.96086 17.7893 3.46957 18 4 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V7.414C18 7.01478 17.842 6.63206 17.5607 6.35074L12.6493 1.43934C12.3679 1.15804 11.9852 1 11.586 1H4Z" fill="#E8E8E8"/>
                      <path d="M12 1V6C12 6.26522 12.1054 6.51957 12.2929 6.70711C12.4804 6.89464 12.7348 7 13 7H18" fill="#A0A0A0"/>
                    </svg>
                    <span className="text-sm text-gray-800">web_dev.md</span>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">Mar 15, 2024</div>
                  <div className="col-span-2 text-sm text-gray-600">12 KB</div>
                  <div className="col-span-2 text-sm text-gray-600">Markdown</div>
                </div>

                <div
                  onClick={() => handleFileClick("systems.md")}
                  className="grid grid-cols-12 gap-4 px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <div className="col-span-6 flex items-center space-x-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 2C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V16C2 16.5304 2.21071 17.0391 2.58579 17.4142C2.96086 17.7893 3.46957 18 4 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V7.414C18 7.01478 17.842 6.63206 17.5607 6.35074L12.6493 1.43934C12.3679 1.15804 11.9852 1 11.586 1H4Z" fill="#E8E8E8"/>
                      <path d="M12 1V6C12 6.26522 12.1054 6.51957 12.2929 6.70711C12.4804 6.89464 12.7348 7 13 7H18" fill="#A0A0A0"/>
                    </svg>
                    <span className="text-sm text-gray-800">systems.md</span>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">Feb 28, 2024</div>
                  <div className="col-span-2 text-sm text-gray-600">8 KB</div>
                  <div className="col-span-2 text-sm text-gray-600">Markdown</div>
                </div>

                <div
                  onClick={() => handleFileClick("what_to_work_on.md")}
                  className="grid grid-cols-12 gap-4 px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <div className="col-span-6 flex items-center space-x-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 2C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V16C2 16.5304 2.21071 17.0391 2.58579 17.4142C2.96086 17.7893 3.46957 18 4 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V7.414C18 7.01478 17.842 6.63206 17.5607 6.35074L12.6493 1.43934C12.3679 1.15804 11.9852 1 11.586 1H4Z" fill="#E8E8E8"/>
                      <path d="M12 1V6C12 6.26522 12.1054 6.51957 12.2929 6.70711C12.4804 6.89464 12.7348 7 13 7H18" fill="#A0A0A0"/>
                    </svg>
                    <span className="text-sm text-gray-800">what_to_work_on.md</span>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">Jan 10, 2024</div>
                  <div className="col-span-2 text-sm text-gray-600">15 KB</div>
                  <div className="col-span-2 text-sm text-gray-600">Markdown</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "markdown-placeholder":
        return (
          <div className="p-8 bg-white text-black font-mono min-h-full">
            <div className="max-w-3xl">
              <p className="text-lg text-gray-700">
                I&apos;ll post some of my essays and what I&apos;ve been thinking soon!
              </p>
            </div>
          </div>
        );
      case "venture":
        return (
          <div className="p-8 bg-white text-black font-mono min-h-full">
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 text-center">
                Coming soon!
              </p>
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
        className="w-full h-full bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
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
        <div className="flex-1 overflow-auto h-full">{getContent()}</div>
      </motion.div>
    </Rnd>
  );
}
