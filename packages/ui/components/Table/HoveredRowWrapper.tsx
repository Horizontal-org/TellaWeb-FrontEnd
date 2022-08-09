import { FunctionComponent } from "react";
import cn from 'classnames'

interface Props {
  children: React.ReactNode;
  isHoverSelected: boolean;
}

const HoveredRowWrapper: FunctionComponent<Props> = ({children, isHoverSelected}) => {

  return (
    <div className="flex">
      <div 
        style={{
          width: 20,
          backgroundImage: cn({
            'linear-gradient(to right, transparent, #f5f5f5)': !isHoverSelected,
            'linear-gradient(to right, transparent, #e9f2ff)': isHoverSelected,
          })
          
        }}
      ></div>
      <div className="flex" style={{ 
        background: cn({
          '#f5f5f5': !isHoverSelected,
          '#e9f2ff': isHoverSelected
        })
      }}>
        { children }
      </div>
    </div>
  )
}

export default HoveredRowWrapper