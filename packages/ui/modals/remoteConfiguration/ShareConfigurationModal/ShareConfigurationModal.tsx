import { FunctionComponent, useRef } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { RadioGroupInput, Checkbox } from '../../../'
import { btnType, Button } from '../../../components/Button/Button'
import { QRCodeCanvas} from 'qrcode.react';
import { Configuration } from '../../../../state/domain/configuration';
import { useReactToPrint } from 'react-to-print'
import { BsFillShareFill } from 'react-icons/bs'
import { MdOutlineFileDownload } from 'react-icons/md'
import { AiFillPrinter } from 'react-icons/ai'
interface Props {
  config: Configuration
}

export const ShareConfigurationModal: FunctionComponent<Props> = ({config}) => {

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const download = () => {
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    let canvas = document.getElementById('qrcode') as HTMLCanvasElement
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <Modal 
      title='Share configuration'
      subtitle={(
        <div>
          Share the “Citizen journalists” configuration using this QR code. Scanning the QR code in Tella will automatically apply the configuration to the app.
        </div>
      )}
      buttonIcon={<BsFillShareFill color="#fff"/>}
      button='Share'
      btnType={btnType.Primary}
      disabled={false}
      render={() => (
        <div>
          <div ref={componentRef} className='py-8 flex justify-center'>
            <QRCodeCanvas 
              id='qrcode'
              
              value={JSON.stringify(config)} 
            />
          </div>
          <div className='flex justify-center'>
            <div className='pr-2'>
              <Button 
                type={btnType.Secondary}
                icon={<MdOutlineFileDownload color='#8b8e8f'/>}
                text='Download'
                onClick={download}
              />
            </div>
            <div>
              <Button 
                type={btnType.Secondary}
                icon={<AiFillPrinter color='#8b8e8f'/>}
                text='Print'
                onClick={handlePrint}
              />
            </div>
          </div>
        </div>
      )}
    />
  )
}