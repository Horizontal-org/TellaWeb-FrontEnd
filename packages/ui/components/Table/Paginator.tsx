import { FunctionComponent  } from 'react'
import cn from 'classnames'
import { HiChevronLeft } from "@react-icons/all-files/hi/HiChevronLeft"
import { HiChevronRight } from "@react-icons/all-files/hi/HiChevronRight"

type Props = {
  gotoPage: (index: number) => void
  previousPage: () => void
  nextPage: () => void
  canPreviousPage: boolean
  canNextPage: boolean
  pageIndex: number
  pageCount: number
  pageTotal: number
}

export const Paginator: FunctionComponent<Props> = ({
  gotoPage,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
  pageIndex,
  pageCount,
  pageTotal,
}) => {
  return (
    <div className="w-full flex justify-center item-center py-8">
      <button 
        onClick={() => previousPage()} disabled={!canPreviousPage}
        className={cn(
          ['p-2 rounded mx-2'],
          {
            'bg-blue-light': canPreviousPage,
            'bg-gray-50': !canPreviousPage
          }
        )}
      >
        <HiChevronLeft color={canPreviousPage ? '#0c7abf' : '#8B8D8E'} />
      </button>{' '}
      <button 
        onClick={() => nextPage()} disabled={!canNextPage}
        className={cn(
          ['p-2 rounded mx-2'],
          {
            'bg-blue-light': canNextPage,
            'bg-gray-50': !canNextPage
          }
        )}
      >
        <HiChevronRight color={canNextPage ? '#0c7abf' : '#8B8D8E'} />
      </button>{' '}      
      <div className='flex items-center pl-2 text-gray-300 font-semibold font-semibold text-base'>
        <strong>
          {'Page ' + (pageIndex + 1)} of {pageTotal}
        </strong>{' '}
      </div>
    </div>
  )
}