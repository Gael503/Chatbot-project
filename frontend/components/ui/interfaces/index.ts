export interface SidebarProps{
  currentPath: string;
  setPath: (value: string) => void;
}

export interface AlertProps{
  title: string;
  message: string;
}