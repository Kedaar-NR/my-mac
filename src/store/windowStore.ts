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
    tabs?: { id: string; title: string; content: string }[]
    activeTabId?: string
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
    // Tabs
    openOrFocusTab: (windowId: string, title: string, content: string) => void
    closeTab: (windowId: string, tabId: string) => void
    setActiveTab: (windowId: string, tabId: string) => void
}

export const useWindowStore = create<WindowStore>((set, get) => ({
    windows: [],
    activeWindowId: null,
    nextZIndex: 1,

    openWindow: (windowData) => {
        const state = get();
        // Prevent duplicates: match by type + (content OR title)
        const existing = state.windows.find(w =>
            w.type === windowData.type && (
                (windowData.content && w.content === windowData.content) ||
                w.title === windowData.title
            )
        );

        if (existing) {
            // Restore if minimized and bring to front
            set((s) => ({
                windows: s.windows.map((w) =>
                    w.id === existing.id
                        ? { ...w, isMinimized: false, isOpen: true, zIndex: s.nextZIndex }
                        : w
                ),
                activeWindowId: existing.id,
                nextZIndex: s.nextZIndex + 1,
            }));
            return;
        }

        const isAboutMe = windowData.content === 'about';
        const isMarkdown = windowData.content === 'markdown-placeholder';
        const isProjects = windowData.content === 'projects';
        const newWindow: Window = {
            ...windowData,
            id: `${windowData.type}-${Date.now()}`,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            x: isMarkdown ? 450 + (state.windows.length * 30) : 400 + (state.windows.length * 30),
            y: isMarkdown ? 120 + (state.windows.length * 30) : 80 + (state.windows.length * 30),
            width: windowData.type === 'finder' ? 900 : 600,
            height: windowData.type === 'finder' ? (isAboutMe ? 1150 : isProjects ? 900 : 700) : 500,
            zIndex: state.nextZIndex,
            tabs: [],
            activeTabId: undefined,
        }

        set((s) => ({
            windows: [...s.windows, newWindow],
            activeWindowId: newWindow.id,
            nextZIndex: s.nextZIndex + 1,
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

    openOrFocusTab: (windowId, title, content) => {
        set((state) => {
            const win = state.windows.find(w => w.id === windowId);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!win) return {} as any;
            const tabs = win.tabs ?? [];
            // Ensure a Home tab exists as the first tab (based on the window's root content)
            let nextTabs = tabs;
            const homeContent = win.content;
            const homeTitle = win.title;
            const hasHome = nextTabs.some(t => t.content === homeContent);
            if ((nextTabs.length === 0 || !hasHome) && homeContent) {
                const homeTab = { id: `${Date.now()}-home`, title: homeTitle, content: homeContent };
                nextTabs = [...nextTabs, homeTab];
            }

            const existing = nextTabs.find(t => t.content === content) || nextTabs.find(t => t.title === title);
            if (existing) {
                return {
                    windows: state.windows.map(w => w.id === windowId ? { ...w, tabs: nextTabs, activeTabId: existing.id } : w)
                };
            }
            const newTab = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title, content };
            return {
                windows: state.windows.map(w => w.id === windowId ? { ...w, tabs: [...nextTabs, newTab], activeTabId: newTab.id } : w)
            };
        })
    },

    closeTab: (windowId, tabId) => {
        set((state) => {
            const win = state.windows.find(w => w.id === windowId);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!win) return {} as any;
            const allTabs = win.tabs ?? [];
            const remaining = allTabs.filter(t => t.id !== tabId);
            // Prefer switching back to Home tab if present
            const home = remaining.find(t => t.content === win.content);
            let activeTabId = win.activeTabId;
            if (activeTabId === tabId) {
                activeTabId = home ? home.id : (remaining.length ? remaining[remaining.length - 1].id : undefined);
            }
            return {
                windows: state.windows.map(w => w.id === windowId ? { ...w, tabs: remaining, activeTabId } : w)
            };
        })
    },

    setActiveTab: (windowId, tabId) => {
        set((state) => ({
            windows: state.windows.map(w => w.id === windowId ? { ...w, activeTabId: tabId } : w)
        }))
    },
}))
