import { FunctionComponent  } from "react";

interface Props {}

const MediaLoader: FunctionComponent<Props> = () => {
  return (
    <div
      style={{height: 'calc(40vw / 1.35)'}}
      className='flex justify-center items-center'
    >
      <div style={{ height: '30px', width: '30px', position: 'relative' }}>
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
    </div>
  )
}

export default MediaLoader