import { FunctionComponent } from "react";
import { btnType, Button } from "../Button/Button";
import { LatestBackups } from "packages/state/domain/backup";
import { format } from "date-fns";
import { FaRegTrashAlt } from "react-icons/fa";
import { useBackupDownloader } from "packages/state/features/backup/useBackupDownloader";
import { StartBackupModal } from "packages/ui/modals/backup/StartBackupModal";
import { DeleteBackupModal } from "packages/ui/modals/backup/DeleteBackupModal";
interface Props {
    backups: LatestBackups
    onBackupStart: () => void
    onBackupDelete: (id) => void
}

export const BackupManagement: FunctionComponent<React.PropsWithChildren<Props>> = ({
    backups,
    onBackupStart,
    onBackupDelete
}) => {

    const [downloadFile] = useBackupDownloader()

    if (!backups) {
        return null
    }

    console.log("🚀 ~ backups:", backups)
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
                                console.log('I GOT A BACKUP')
                                downloadFile(
                                    backups.latest.id, 
                                    backups.latest.folderName
                                )
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