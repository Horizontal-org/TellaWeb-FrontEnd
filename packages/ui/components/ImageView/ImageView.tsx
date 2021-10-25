import { FunctionComponent } from 'react'
import { IReportFile } from '../../domain/ReportFile'
import { ReportFileType } from "../../domain/ReportFileType"

type Props = {
  file: IReportFile,
  onClick?: () => void
};

export const ImageView: FunctionComponent<Props> = ({ file, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="w-full h-full bg-gray-25 rounded-md cursor-pointer"
      style={{
        backgroundImage: `url(${file.src})`,
        backgroundPosition: "center",
        backgroundSize: "cover"
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
