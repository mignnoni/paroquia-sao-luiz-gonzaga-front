import type { IMenu } from "@/interfaces/IMenu";
import { HiOutlineHome, HiHome } from "react-icons/hi";
import { LuMegaphone, LuUsers } from "react-icons/lu";
import { create } from "zustand";

interface ISidebarState {
  isOpen: boolean;
  toggle: () => void;
  menu: UserMenu[];
  setMenu: (userRole: string) => void;
}

type UserMenu = Omit<IMenu, "roles">;

const menuItems: IMenu[] = [
  {
    title: "Página inicial",
    href: "/",
    icon: <HiOutlineHome />,
    iconActive: <HiHome />,
    roles: ["admin", "manager", "member"],
  },
  {
    title: "Membros",
    href: "/admin/membros",
    icon: <LuUsers />,
    iconActive: <LuUsers />,
    roles: ["admin"],
  },
  {
    title: "Comunicados",
    href: "/comunicados",
    icon: <LuMegaphone />,
    iconActive: <LuMegaphone />,
    roles: ["admin", "manager"],
  },
];

export const sidebarStore = create<ISidebarState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  menu: [],
  setMenu: (userRole: string) =>
    set(() => ({ menu: menuItems.filter((x) => x.roles.includes(userRole)) })),
}));
