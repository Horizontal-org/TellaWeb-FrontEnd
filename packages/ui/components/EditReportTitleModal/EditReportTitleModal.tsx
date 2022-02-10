import { FunctionComponent, useState, useEffect } from 'react'
import { RiPencilFill } from 'react-icons/ri'
import { ButtonPopup, Button, TextInput, ButtonOption } from '../../'

type Props = {
  onSubmit: (name: string) => void
}

export const EditReportTitleModal: FunctionComponent<Props> = ({ onSubmit }) => {
  const [name, handleName] = useState<string>('')

  return (
    <ButtonPopup 
      toggleButton={(toggle) => (
        <ButtonOption
          text="RENAME"
          onClick={toggle}
          color='#8B8E8F'
          icon={<RiPencilFill/>}
        />
      )}
      render={(toggle) => (
        <div className='p-4'>
          <p className='text-xxxl font-bold'>
            Rename report
          </p>
          <p className='py-2 text-base text-gray-600'>
          This will change the name of the report as it appears on Tella Web.
          </p>
          <div className='py-4'>
            <TextInput
              name='name'
              placeholder='Report name'
              value={name}
              onChange={(e) => { handleName(e.target.value) }}
            />
          </div>

          <div >
            <Button 
              text='RENAME'
              full={true}
              disabled={!(name.length > 0)}
              onClick={() => {
                onSubmit(name)
                toggle()
              }}
            />
          </div>
          
        </div>
      )}
    />
  )
}