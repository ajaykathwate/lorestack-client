import { create } from 'zustand'

interface UiState {
  sidebarOpen: boolean
}

interface UiActions {
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useUiStore = create<UiState & UiActions>((set) => ({
  sidebarOpen: false,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
