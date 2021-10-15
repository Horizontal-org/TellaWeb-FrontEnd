import { Item } from "./Item";

export enum AppLockChoice {
  PATTERN,
  PIN,
  PASSWORD,
}

export enum CamouflageChoice {
  ICON,
  CALCULATOR,
  NOTEPAD,
}

export type AppLockConfig = Partial<Record<AppLockChoice, boolean>>;
export type CamouflageConfig = Partial<Record<CamouflageChoice, boolean>>;

export interface Configuration extends Item {
  date: number;
  connections: number;
  status: string;
  applock: AppLockConfig;
  camouflage: CamouflageConfig;
}
