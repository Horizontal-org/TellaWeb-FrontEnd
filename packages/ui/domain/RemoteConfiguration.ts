
export interface Camouflage {
  visible: boolean;
  calculator: boolean;
  change_name: boolean;
}

export interface CrashReports { 
  visible: boolean;
  enabled: boolean;
}

export interface RemoteConfiguration {
  id: string;
  name: string;
  camouflage: Camouflage;
  crashReports: CrashReports;
  serversVisible: boolean;
  date: number;
}