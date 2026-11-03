
export interface Backup {
  id: string;
  folderName: string;
  status: string;
  createdAt: string;  
}

// bytes
export interface BackupSpace {
    needed: number
    available: number
}

export interface LatestBackups {
    deleted: Backup
    latest: Backup
    processing: Backup
}
