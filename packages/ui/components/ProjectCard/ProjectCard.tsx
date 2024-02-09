import { Project } from "packages/state/domain/project";
import { FunctionComponent } from "react";
import { MdOutlineSettings } from 'react-icons/md'
import { format } from 'date-fns'
import { btnType, Button } from "../Button/Button";
import { useRouter } from "next/router";
import { FaRegFileAlt, FaRegUser } from "react-icons/fa";

interface Props {
  data: Project;
}

const ProjectCard: FunctionComponent<React.PropsWithChildren<Props>> = ({ data }) => {
  const router = useRouter()
  return (
    <div 
      className="border border-gray-100 flex flex-col justify-between cursor-pointer hover:border-blue-light"
      style={{ width: 280, height: 180, borderRadius: '8px' }}
    >

      <p
        className="pt-6 px-6 font-sans font-bold text-gray-600" 
        style={{
          fontSize: '18px', 
          lineClamp: '2',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
          display: '-webkit-box',
          overflow: 'hidden',
          minHeight: '80px'
        }}
      >
        { data.name }
      </p>

      <div>
        <div className="px-6 font-sans text-base font-normal text-gray-500 pt-6 pb-2">
          { (data.reports.length + ' ') + (data.reports.length === 1 ? ' Report' : 'Reports') }
        </div>
        <div 
          className="px-6 py-2 flex items-center justify-between bg-gray-50"
          style={{ borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }} 
        >
         <div className="flex items-center">
            <div 
                className="p-2  cursor-pointer text-gray-500 active:shadow-inbox rounded"
                onClick={(e) => {
                  e.stopPropagation()                  
                  router.push(`/project/${data.id}/users`)
                }}
              >                
                <FaRegUser size={14} />
            </div>
            <div 
                className="p-2  cursor-pointer text-gray-500 active:shadow-inbox rounded"
                onClick={(e) => {
                  e.stopPropagation()              
                  router.push(`/project/${data.id}/resources`)
                }}
              >
                <FaRegFileAlt size={14} />
            </div>
         </div>

          <div 
            className="p-2 cursor-pointer text-gray-500 active:shadow-inbox rounded"
            onClick={(e) => {
              e.stopPropagation()              
              router.push(`/project/${data.id}/settings`)
            }}
          >
            <MdOutlineSettings />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard