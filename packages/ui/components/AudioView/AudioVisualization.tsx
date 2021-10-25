import { FunctionComponent } from 'react'

// svgs made react component 
import StreamVisual from './StreamVisual'
import StreamDefault from './StreamDefault'

type Props = {
  currentPercentage: number
}

export const AudioVisualization: FunctionComponent<Props> = ({ currentPercentage }) => {
  return (
    <div className='h-60 w-full flex justify-center items-center bg-gray-200 my-5'>
      {/* <div className='p-4'> */}
        <div className="relative" style={{
          height: 80,
          width: 468
        }}>
          <div className="absolute top-0">
            <StreamDefault />
          </div>
          <div 
            className="absolute top-0"
            style={{
              marginLeft: '-1px',
              marginTop: '-1px'
            }}
          >
            <StreamVisual 
              width={`${currentPercentage}%`}
            />
          </div>
        </div>
      {/* </div> */}
    </div>
  )
}