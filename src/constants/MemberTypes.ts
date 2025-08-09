import type { ICollection } from "@/interfaces/ICollection";

export const MEMBER_TYPES = {
  0: "Membro",
  1: "Supervisor",
  2: "Administrador",
  3: "Escrita Fiscal",
  4: "Documentos",
  5: "Analista",
  6: "Fiscal (NFSe)",
  7: "Gerente",
} as const;

export const MemberTypes = {
  TeamMember: 0,
  Supervisor: 1,
  Admin: 2,
  TaxAccounting: 3,
  Documents: 4,
  Analyst: 5,
  TaxAccountingNfse: 6,
  Manager: 7,
} as const;

export const MEMBER_TYPES_WITH_NAMES: ICollection[] = [
  {
    label: "Membro",
    value: "0",
    description: "",
  },
  {
    label: "Supervisor",
    value: "1",
    description: "",
  },
  {
    label: "Administrador",
    value: "2",
    description: "",
  },
  {
    label: "Escrita Fiscal",
    value: "3",
    description: "",
  },
  {
    label: "Documentação",
    value: "4",
    description: "",
  },
  {
    label: "Analista",
    value: "5",
    description: "",
  },
  {
    label: "Fiscal - NFSe",
    value: "6",
    description: "",
  },
  {
    label: "Gerente",
    value: "7",
    description: "",
  },
];

export const MEMBER_TYPES_WITH_NAMES_FOR_MANAGER: ICollection[] = [
  {
    label: "Cliente",
    value: "0",
    description: "",
  },
];
