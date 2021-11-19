import { FunctionComponent, useRef } from 'react'

type Props = {
  parsedCurrentTime: string
  parsedDuration: string
  percentage: string
  onBarClick: (
    e,
    clientRectLeft,
    clientWidth
  ) => void
}

export const MediaProgressBar: FunctionComponent<Props> = ({
  parsedCurrentTime,
  parsedDuration,
  percentage,
  onBarClick
}) => {
  const progressRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className='flex items-center'>
      <div className='p-4 text-gray-500 text-sm'>    
        { parsedCurrentTime  }
      </div>
      <div className="w-full relative">
        <div
          ref={progressRef}
          className="w-full bg-gray-200"
          style={{
            height: 4
          }}
        >
        </div>

        <div
          className="bg-blue-300 absolute top-0"
          style={{
            height: 4,
            width: percentage
          }}
        >
        </div>

        <div
          className="w-full cursor-pointer bg-transparent absolute top-0"
          style={{ height: 4 }}
          onClick={(e) => {onBarClick(e, progressRef.current.getBoundingClientRect().left, progressRef.current.clientWidth)}}
        >
        </div>
      </div>
      <div className='p-4 text-gray-500 text-sm'>
        { parsedDuration }
      </div>
    </div>
  )
}