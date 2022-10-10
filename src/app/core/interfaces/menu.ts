export interface Menu {
  id: number;
  pathRoute?: string;
  label: string;
  icon: string;
  order: number;
  submenu: Submenu[];
}

interface Submenu {
  id: number;
  pathRoute: string;
  label: string;
  order: number;
  menuId: number;
}
