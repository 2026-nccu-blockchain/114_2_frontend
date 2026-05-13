/**
 * UI Store
 * Zustand store for managing UI state
 */

import { create } from 'zustand'

interface UIState {
  isSidebarOpen: boolean
  isDarkMode: boolean
  notificationCount: number
  toggleSidebar: () => void
  toggleDarkMode: () => void
  setNotificationCount: (count: number) => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isDarkMode: false,
  notificationCount: 0,

  toggleSidebar: () => { set((state) => { return { isSidebarOpen: !state.isSidebarOpen } }) },

  toggleDarkMode: () => { set((state) => { return { isDarkMode: !state.isDarkMode } }) },

  setNotificationCount: (count) => { set({ notificationCount: count }) },
}))
