import { FunctionComponent, useState, useEffect } from 'react'
import { ButtonPopup, Button, TextArea } from '../../'
import { btnType } from '../Button/Button'

type Props = {
  onSubmit: (note: string) => void
}

export const EditUserNoteModal: FunctionComponent<Props> = ({ onSubmit }) => {
  const [note, handleNote] = useState<string>('')

  return (
    <ButtonPopup 
      toggleButton={(toggle) => (
        <Button
          text="EDIT"
          onClick={toggle}
          type={btnType.Secondary}
        />
      )}
      render={(toggle) => (
        <div className='p-4'>
          <p className='font-sans py-2 text-gray-600 text-xxxl font-bold'>
            Edit note
          </p>
          <p className='font-sans font-normal text-sm text-gray-500'>
            Add a note to keep track of information relevant to the user
          </p>
          <div className='py-4'>
            <TextArea
              name='note'
              placeholder='Note'
              value={note}
              onChange={(e) => { handleNote(e.target.value) }}
            />


          </div>

          <div className='py-4'>
            <Button 
              text='SAVE'
              full={true}
              disabled={note.length === 0}
              onClick={() => {
                onSubmit(note)
                toggle()
              }}
            />
          </div>
          
        </div>
      )}
    />
  )
}