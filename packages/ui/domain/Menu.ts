import { ReactNode } from 'react'

export interface MenuDescription {
  text: string
  icon?: ReactNode
  disabled?: boolean
  selected?: boolean
  onClick?: (event: unknown) => void
}
