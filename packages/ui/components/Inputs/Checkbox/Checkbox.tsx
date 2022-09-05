import { FunctionComponent } from 'react'
import { ConnectableObservable } from 'rxjs';

interface Props {
  onChange: () => void;
  checked: boolean;
  label: string;
}

export const Checkbox: FunctionComponent<React.PropsWithChildren<Props>> = ({ 
  checked, 
  onChange,
  label
}) => {
  return (
    <label>
      <input
        className='checkbox-base'
        type="checkbox"
        value='test-check'
        onChange={(e) => {
          onChange()
        }}
      />      

      <svg
        className={`checkbox ${checked ? "checkbox--active" : ""}`}
        aria-hidden="true"
        viewBox="0 0 15 11"
        fill="none"
      >
        <path
          d="M1 4.5L5 9L14 1"
          strokeWidth="2"
          stroke={checked ? "#fff" : "none"}
        />
      </svg>
      
      <span className='ml-8 text-base text-gray-600 font-semibold'>
        { label }      
      </span>
    </label>
  )
}

