import type { IMenu } from "@/interfaces/IMenu";
import {
  HiOutlineHome,
  HiHome,
  HiDocumentText,
  HiClipboardList,
} from "react-icons/hi";
import { LuClipboardList, LuFileText } from "react-icons/lu";
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
    roles: [
      "admin",
      "manager",
      "teamMember",
      "supervisor",
      "taxAccounting",
      "documents",
      "analyst",
      "taxAccountingNfse",
    ],
  },
  {
    title: "Contratos",
    href: "/contratos",
    icon: <LuFileText />,
    iconActive: <HiDocumentText />,
    roles: [
      "admin",
      "manager",
      "teamMember",
      "supervisor",
      "taxAccounting",
      "documents",
      "analyst",
      "taxAccountingNfse",
    ],
  },
  {
    title: "Tarefas base",
    href: "/tarefas-base",
    icon: <LuClipboardList />,
    iconActive: <HiClipboardList />,
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
