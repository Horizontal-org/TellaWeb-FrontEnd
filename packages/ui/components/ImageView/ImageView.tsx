import { FunctionComponent } from 'react'
import { IReportFile } from '../../domain/ReportFile'
import Image from "next/image";

type Props = {
  file: IReportFile,
  onClick?: () => void
};

export const ImageView: FunctionComponent<Props> = ({ file, onClick }) => {
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
        />
      </div>
    </div>
    
  )
} 

ImageView.defaultProps = {
  onClick: () => {}
}


