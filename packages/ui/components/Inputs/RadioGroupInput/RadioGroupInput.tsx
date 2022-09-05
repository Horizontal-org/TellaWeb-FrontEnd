import { FunctionComponent, ChangeEventHandler } from 'react'

interface Props {
  value: string;
  elements: {
    name: string;
    value: string;
    label: string;
  }[];
  onChange: ChangeEventHandler<HTMLInputElement>
}

export const RadioGroupInput: FunctionComponent<React.PropsWithChildren<Props>> = ({ elements, onChange, value }) => {
  return (
    <div>
      { elements.map((e, i) => (
        <div key={i} className='py-2'>
          <label className='radio-label text-base text-gray-600 font-semibold'>
            <input 
              type='radio'
              name={e.name}
              value={e.value}
              checked={value === e.value}
              onChange={onChange}
            />
            { e.label }
          </label>
        </div>
      ))}
    </div>
  )
}