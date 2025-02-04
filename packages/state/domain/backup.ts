
export interface Backup {
  id: string;
  folderName: string;
  status: string;
  createdAt: string;  
}

export interface LatestBackups {
    deleted: Backup
    latest: Backup
    processing: Backup
}
