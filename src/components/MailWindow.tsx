"use client";

import { useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import {
  Send,
  Paperclip,
  Bold,
  Italic,
  Underline,
  Link,
  Smile,
} from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import { Window } from "@/store/windowStore";

interface MailWindowProps {
  window: Window;
}

export default function MailWindow({ window }: MailWindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    setActiveWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowStore();
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Message sent! (This is a demo)");
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
      minWidth={500}
      minHeight={400}
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
            <button className="p-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600 transition-colors">
              <Send size={16} />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-lg">
              <Paperclip size={16} />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-image.png200 rounded">
              <Bold size={16} />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <Italic size={16} />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <Underline size={16} />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <Link size={16} />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <Smile size={16} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {window.content === "contact" ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Contact Me
                </h2>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-black text-xl">@</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Email
                      </h3>
                      <p className="text-blue-600 font-medium">
                        kedaarnr@berkeley.edu
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-center">
                    Feel free to reach out for collaborations, opportunities, or
                    just to say hello!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To:
                </label>
                <input
                  type="email"
                  value={formData.to}
                  onChange={(e) =>
                    setFormData({ ...formData, to: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject:
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message:
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                  placeholder="Enter your message"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </Rnd>
  );
}
