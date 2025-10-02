import { create } from 'zustand'

export interface Window {
    id: string
    title: string
    type: 'finder' | 'mail' | 'portfolio'
    isOpen: boolean
    isMinimized: boolean
    isMaximized: boolean
    x: number
    y: number
    width: number
    height: number
    zIndex: number
    content?: string
}

interface WindowStore {
    windows: Window[]
    activeWindowId: string | null
    nextZIndex: number

    // Window actions
    openWindow: (window: Omit<Window, 'id' | 'isOpen' | 'isMinimized' | 'isMaximized' | 'x' | 'y' | 'width' | 'height' | 'zIndex'>) => void
    closeWindow: (id: string) => void
    minimizeWindow: (id: string) => void
    maximizeWindow: (id: string) => void
    restoreWindow: (id: string) => void
    setActiveWindow: (id: string) => void
    updateWindowPosition: (id: string, x: number, y: number) => void
    updateWindowSize: (id: string, width: number, height: number) => void
    bringToFront: (id: string) => void
}

export const useWindowStore = create<WindowStore>((set, get) => ({
    windows: [],
    activeWindowId: null,
    nextZIndex: 1,

    openWindow: (windowData) => {
        const isAboutMe = windowData.content === 'about';
        const isMarkdown = windowData.content === 'markdown-placeholder';
        const newWindow: Window = {
            ...windowData,
            id: `${windowData.type}-${Date.now()}`,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            x: isMarkdown ? 450 + (get().windows.length * 30) : 400 + (get().windows.length * 30),
            y: isMarkdown ? 120 + (get().windows.length * 30) : 80 + (get().windows.length * 30),
            width: windowData.type === 'finder' ? 900 : 600,
            height: windowData.type === 'finder' ? (isAboutMe ? 1150 : 700) : 500,
            zIndex: get().nextZIndex,
        }

        set((state) => ({
            windows: [...state.windows, newWindow],
            activeWindowId: newWindow.id,
            nextZIndex: state.nextZIndex + 1,
        }))
    },

    closeWindow: (id) => {
        set((state) => ({
            windows: state.windows.filter((window) => window.id !== id),
            activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
        }))
    },

    minimizeWindow: (id) => {
        set((state) => ({
            windows: state.windows.map((window) =>
                window.id === id ? { ...window, isMinimized: true } : window
            ),
        }))
    },

    maximizeWindow: (id) => {
        set((state) => ({
            windows: state.windows.map((window) =>
                window.id === id ? { ...window, isMaximized: true } : window
            ),
        }))
    },

    restoreWindow: (id) => {
        set((state) => ({
            windows: state.windows.map((window) =>
                window.id === id
                    ? { ...window, isMinimized: false, isMaximized: false }
                    : window
            ),
        }))
    },

    setActiveWindow: (id) => {
        set((state) => ({
            activeWindowId: id,
            windows: state.windows.map((window) =>
                window.id === id
                    ? { ...window, zIndex: state.nextZIndex }
                    : window
            ),
            nextZIndex: state.nextZIndex + 1,
        }))
    },

    updateWindowPosition: (id, x, y) => {
        set((state) => ({
            windows: state.windows.map((window) =>
                window.id === id ? { ...window, x, y } : window
            ),
        }))
    },

    updateWindowSize: (id, width, height) => {
        set((state) => ({
            windows: state.windows.map((window) =>
                window.id === id ? { ...window, width, height } : window
            ),
        }))
    },

    bringToFront: (id) => {
        set((state) => ({
            activeWindowId: id,
            windows: state.windows.map((window) =>
                window.id === id
                    ? { ...window, zIndex: state.nextZIndex }
                    : window
            ),
            nextZIndex: state.nextZIndex + 1,
        }))
    },
}))
