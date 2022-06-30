import { ReactNode } from 'react'

export interface MenuDescription {
  permission: string
  text: string
  icon?: ReactNode
  disabled?: boolean
  selected?: boolean
  onClick?: (event: unknown) => void
}
