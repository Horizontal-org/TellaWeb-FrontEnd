import { FunctionComponent } from 'react'
import { IReportFile } from '../../domain/ReportFile'

type Props = {
  file: IReportFile,
  onClick?: () => void
};

export const ImageView: FunctionComponent<Props> = ({ file, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="w-full h-full bg-gray-25 rounded-md cursor-pointer bg-cover bg-center"
      style={{
        backgroundImage: `url(${file.src})`
      }}
    >
      <div 
        className="border h-full w-full rounded-md border-gray-100 hover:border-gray-500 hover:bg-black hover:bg-opacity-10"
      />
    </div>
  )
} 

ImageView.defaultProps = {
  onClick: () => {}
}
