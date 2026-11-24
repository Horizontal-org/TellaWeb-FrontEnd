import { FunctionComponent } from "react"
import { HiMiniChevronDown, HiMiniChevronUp, HiMiniChevronUpDown } from "react-icons/hi2";

interface Props {
  isSortable: boolean
  sorted: "asc" | "desc" | false
}

export const Sortable: FunctionComponent<Props> = ({ isSortable, sorted }) => {
  return (
    <div className="pl-2">
      {isSortable && (
        sorted === "asc" ? (
          <HiMiniChevronUp size={16} />
        ) : sorted === 'desc' ? (
          <HiMiniChevronDown size={16} />
        ) : (
          <HiMiniChevronUpDown size={16} />
        )
      )}
    </div>
  )
}