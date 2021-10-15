import { useState } from 'react'

export const useToggleOptions = <T extends string | number | symbol>(
  initialValue: Partial<Record<T, boolean>>
): [Partial<Record<T, boolean>>, (option: T) => () => void] => {
  const [options, setOptions] = useState<Partial<Record<T, boolean>>>(initialValue)

  const toggleOption = (option: T) => () => {
    setOptions({
      ...options,
      [option]: !options[option],
    })
  }

  return [options, toggleOption]
}
