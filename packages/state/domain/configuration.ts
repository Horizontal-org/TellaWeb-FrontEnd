
export interface Camouflage {
  visible: boolean;
  calculator: boolean;
  change_name: boolean;
}

export interface CrashReports { 
  visible: boolean;
  enabled: boolean;
}

export interface Configuration {
  id: string;
  name: string;
  camouflage: Camouflage;
  crashReports: CrashReports;
  serversVisible: boolean;
  createdAt: any;
}

export interface ConfigurationQuery {
  sortKey?: string;
  sortOrder?: string;
  search?: string;
  page: number;
  total?: number;
  size: number;
}