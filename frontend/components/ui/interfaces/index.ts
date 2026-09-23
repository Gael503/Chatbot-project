export interface SidebarProps{
  currentPath: string;
  setPath: (value: string) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export interface AlertProps{
  title: string;
  message: string;
}