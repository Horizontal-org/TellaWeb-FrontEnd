import { FunctionComponent, useState, useRef } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { Button, btnType } from '../../../components/Button/Button'
import { IoMdAdd } from 'react-icons/io'
import { MdPictureAsPdf } from "react-icons/md";
import axios from 'axios'
import { useToast } from 'components/ToastWrapper';
import { format } from 'path';


interface Props {
  onSubmit: () => void;
}

export const CreateResourceModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit,
}) => {

  const handleToast = useToast()
  const hiddenFileInput = useRef(null);
  const [file, handleFile] = useState(null)
  const [modalOpen, handleModalOpen] = useState(false)
  const [processing, handleProcessing] = useState(null)

  // validations  
  const [nameTaken, handleNameTaken] = useState(false)
  const [fileTooLarge, handleFileTooLarge] = useState(false)

  const handleButtonPress = () => {
    hiddenFileInput.current.click();
  };

  const checkFilename = async (name: string) => {
    handleNameTaken(false)
    handleProcessing('Checking name...')

    const token = localStorage.getItem("access_token")
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resource/check/${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    })

    if (res.data.taken) {
      handleNameTaken(true)
    }

    handleProcessing(null)
    console.log("🚀 ~ file: CreateResourceModal.tsx:38 ~ checkFilename ~ res:", res)
  }

  const checkFileSize = (size: number) => {
    const sizeInMB = size / (1024 ** 2)
    if (sizeInMB > 20) {
      handleFileTooLarge(true)
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    handleFile(file)
    checkFilename(file.name)
    checkFileSize(file.size)
  }

  const uploadFile = () => {
    const token = localStorage.getItem("access_token")
    const reader = new FileReader()

    reader.onload = async (ev: ProgressEvent<FileReader>): Promise<void> => {
      try {
        const controller = new AbortController()
        await axios({
          method: 'put',
          url: `${process.env.NEXT_PUBLIC_API_URL}/resource/upload/${file.name}`,
          signal: controller.signal,
          onUploadProgress: (u) => {
            let percentCompleted = Math.round((u.loaded * 100) / u.total);
            handleProcessing(`Saving ${percentCompleted}%`)
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          data: ev.target.result
        });

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resource/upload/${file.name}`, {
          method: 'POST',
          body: JSON.stringify({ size: file.size }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        // FINISH
        onSubmit()
        handleModalOpen(false)
      } catch (e) {
        if (e.status === 413) {
          handleToast('The file selected is larger than 20MB. Please select another smaller file.', "danger");
        } else {
          handleToast('There was an unexpected error, please try again.', "danger");
        }
      } finally {
        handleProcessing(null)
        handleFile(null)
      }
    }
    reader.readAsArrayBuffer(file)

  }


  return (
    <Modal
      externalOpen={modalOpen}
      onExternalOpen={() => {
        handleModalOpen(true)
      }}
      onClose={() => {
        handleModalOpen(false)
      }}
      title='Create new resource'
      button='CREATE RESOURCE'
      buttonIcon={<IoMdAdd color='white' />}
      btnType={btnType.Primary}
      subtitle='Create a new resource to your space. The resource will only be available to your users after it is added to specific projects.'
      submit='ADD RESOURCE'

      render={() => (
        <div>
          <div className=''>

            <p className='py-2 font-normal text-md text-gray-500'>{file ? 'File selected' : 'Select file'}</p>

            {file ? (
              <div className='w-full flex justify-between'>
                <div className='flex items-center'>
                  <MdPictureAsPdf color="#8B8E8F" size={30} />
                  <p className='py-2 font-normal text-sm text-gray-500'>{file.name}</p>
                </div>

                <Button
                  text="Clear"
                  type={btnType.Secondary}
                  onClick={(event: MouseEvent) => {
                    handleFile(null)
                    handleNameTaken(false)
                    handleFileTooLarge(false)
                  }}
                />
              </div>
            ) : (
              <div className='w-full flex justify-between'>
                <p className='py-2 font-normal text-sm text-gray-500'>Select the PDF from your computer to add it as a resource to your space (max 20MB).</p>

                <Button
                  text="Select PDF"
                  type={btnType.Secondary}
                  onClick={(event: MouseEvent) => {
                    event.preventDefault();
                    event.stopPropagation()
                    handleButtonPress()
                  }}
                />
              </div>
            )}

            <input
              type="file"
              accept=".pdf"
              ref={hiddenFileInput}
              className='hidden'
              onChange={handleFileChange}
              onClick={(e) => {
                e.currentTarget.value = null
              }}
            />
          </div>


          {nameTaken && (
            <>
              <ErrorMessage
                message='A resource with this name already exists in your workspace. Please select a file with a different name. '
              />
            </>
          )}

          {fileTooLarge && (
            <>
              <ErrorMessage
                message='The file selected is larger than 20MB. Please select another smaller file.'
              />
            </>
          )}

          <div className='pt-8'>
            <Button
              disabled={!!(processing) || nameTaken || fileTooLarge || !file}
              text={processing || 'CREATE RESOURCE'}
              type={btnType.Primary}
              full={true}
              onClick={() => {
                uploadFile()
              }}
            />
          </div>

        </div>
      )}
    />
  )
}