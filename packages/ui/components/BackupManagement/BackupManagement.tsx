import { FunctionComponent } from "react";
import { btnType, Button } from "../Button/Button";
import { BackupSpace, LatestBackups } from "packages/state/domain/backup";
import { format } from "date-fns";
import { FaRegTrashAlt } from "react-icons/fa";
import { useBackupDownloader } from "packages/state/features/backup/useBackupDownloader";
import { StartBackupModal } from "packages/ui/modals/backup/StartBackupModal";
import { DeleteBackupModal } from "packages/ui/modals/backup/DeleteBackupModal";
interface Props {
    backups: LatestBackups
    backupSpace?: BackupSpace
    onBackupStart: () => void
    onBackupDelete: (id) => void
}

const gb = (bytes: number) => `${(bytes / 1024 ** 3).toFixed(1)} GB`

export const BackupManagement: FunctionComponent<React.PropsWithChildren<Props>> = ({
    backups,
    backupSpace,
    onBackupStart,
    onBackupDelete
}) => {

    const [downloadFile] = useBackupDownloader()

    if (!backups) {
        return null
    }

    return (
        <div className="pt-8">
            <p className="font-bold text-md text-gray-600">
                Backups
            </p>

            <div 
                className="flex justify-between items-center py-4 border-b"
            >
                <div className="flex items-center">
                    <p className="text-gray-600 uppercase flex items-center" style={{ width: 350 }}>
                        GENERATE NEW BACKUP
                    </p>
                    <p>{ backups.processing ? 'Your backup is being generated. Come back in a few minutes to download it' : ''}</p>
                </div>

                <StartBackupModal 
                    backups={backups}
                    onBackupStart={onBackupStart}
                />
                
            </div>


            { backupSpace && (
                <div 
                className="flex justify-between items-center py-4 border-b"
                >
                    <div className="flex items-center">
                        <p className="text-gray-600 uppercase flex items-center" style={{ width: 350 }}>
                            DISK SPACE
                        </p>
                        <p>{`${gb(backupSpace.available)} available, a new backup needs about ${gb(backupSpace.needed)}`}</p>
                    </div>
                </div>
            )}

            { backups.latest && (
                <div 
                className="flex justify-between items-center py-4 border-b"
                >
                    <div className="flex items-center">
                        <p className="text-gray-600 uppercase flex items-center" style={{ width: 350 }}>
                            LATEST BACKUP
                        </p>
                        <p>{`Generated on ${format(new Date(backups.latest.createdAt), "dd LLLL yyyy 'at' HH:mm")}`}</p>
                    </div>

                    <div className="flex items-center">
                        <div className="pr-4">

                            <DeleteBackupModal 
                                onSubmit={() => {
                                    onBackupDelete(backups.latest.id)
                                }}               
                            />
             
                        </div>
                        <Button 
                            text="DOWNLOAD" 
                            type={btnType.Secondary} 
                            onClick={(e: any) => {
                                e.preventDefault()
                                downloadFile(backups.latest.id)
                            }}
                        /> 
                    </div>
                </div>
            )}


            { backups.deleted && (
                <div 
                className="flex justify-between items-center py-4 border-b"
                >
                    <div className="flex items-center">
                        <p className="text-gray-600 uppercase flex items-center" style={{ width: 350 }}>
                            DELETED BACKUP
                        </p>
                        <p>{`Generated on ${format(new Date(backups.deleted.createdAt), "dd LLLL yyyy 'at' HH:mm")}`}</p>
                    </div>

                </div>
            )}
        </div>
    )
}