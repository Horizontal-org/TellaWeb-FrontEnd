import { FunctionComponent, useState } from 'react'
import { IReportFile } from '../../domain/ReportFile'
import Image from "next/image";
import MediaLoader from '../MediaLoader/MediaLoader';

type Props = {
  file: IReportFile,
  onClick?: () => void,
};

export const ImageView: FunctionComponent<React.PropsWithChildren<Props>> = ({ file, onClick }) => {

  const [loading, handleLoading] = useState(true)

  return (
    <div className='w-full h-full flex justify-center items-center'>

      <div className=' relative flex justify-center w-full h-full'>
        <Image
          onClick={onClick}
          className='cursor-pointer'
          src={window.location.origin + file.src}
          alt={file.fileName}
          layout='fill'
          objectFit='contain'
          unoptimized={true}
          onLoadingComplete={() => {
            handleLoading(false)
          }}
        />

        { loading && (
          <MediaLoader />
        )}
        
      </div>
    </div>
    
  )
} 

ImageView.defaultProps = {
  onClick: () => {}
}


