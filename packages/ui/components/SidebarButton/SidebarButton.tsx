import { FunctionComponent } from 'react'
import cn from 'classnames'

interface Props {
  onClick: () => void
  position?: string
}

export const SidebarButton: FunctionComponent<React.PropsWithChildren<Props>> = ({ 
  onClick,
  position
}) => {
  return (
    <div>
      <button
        type="button"
        style={{ lineHeight: 1, height: 36, width: 36 }}
        onClick={onClick}
        className={cn({
          "active:shadow-inbox rounded": true,
          "flex flex-col justify-center items-center focus:outline-none cursor-pointer border-r my-2 stroke-current text-customgray-500 hover:bg-gray-50": true,
          "transform rotate-180": position && position === 'right'
        })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="12"
          fill="none"
          viewBox="0 0 14 12"
        >
          <mask id="path-1-inside-1_1752_654" fill="#fff">
            <rect width="13.5" height="12" x="0.25" rx="1"></rect>
          </mask>
          <rect
            width="13.5"
            height="12"
            x="0.25"
            strokeWidth="3"
            mask="url(#path-1-inside-1_1752_654)"
            rx="1"
          ></rect>
          <path 
            strokeWidth="1.5" 
            d="M5.5 0.75L5.5 11.25"
          ></path>
        </svg>
      </button>
    </div>
  )
}