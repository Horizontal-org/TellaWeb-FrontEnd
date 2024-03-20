import { FunctionComponent, useState } from "react";
import styled from 'styled-components'
import axios from 'axios'
import { BsChatLeftText } from 'react-icons/bs'
import { IoSend } from 'react-icons/io5'
import { Button, btnType } from "../Button/Button";
import { TextArea } from "../TextArea/TextArea";
import { useToast } from 'components/ToastWrapper'

interface Props {}

const submitFeedback = async(feedback: string, handleToast, displaySuccess) => {
  try {
    await axios.post(`https://api.feedback.tella-app.org/opinions`, {
      platform: 'WEB',
      text: feedback
    }, {
      headers: {
        'X-Tella-Platform': 'wearehorizontal'
      }
    })


    displaySuccess()
  } catch (err) {
    handleToast('Your feedback could not be sent. Please try again.', 'danger')
  }
}


export const FeedbackBox: FunctionComponent<Props> = () => {
  const [visible, handleVisible] = useState(false) 
  const [success, handleSuccess] = useState(false)
  const [feedback, handleFeedback] = useState<string>('')
  const handleToast = useToast()

  const reset = ( ) => {
    handleFeedback('')
    handleVisible(false)
  }

  const displaySuccess = () => {
    handleSuccess(true)
    setTimeout(() => {
      handleSuccess(false)
      reset()
    }, 2000)
  }
  return (
    <Wrapper>
      
      { visible && (
        <>
          <Box>
            { success ? (
              <Thanks>
                {`Thank you for sharing your feedback :)`}
              </Thanks>
            ) : (
              <>
                <BoxText>
                  Tell us if you are experiencing a bug, have a request for a new feature, or have any other feedback. 
                </BoxText>
                <BoxText>
                  This feedback is anonymous, so make sure to include contact information if you want a response from us.
                </BoxText>

                <TextArea
                  name='feedback'
                  placeholder='Feedback'
                  value={feedback}
                  onChange={(e) => { handleFeedback(e.target.value) }}
                />

                <BottomBox>
                  <Button
                    disabled={feedback.length === 0}
                    type={btnType.Primary}
                    rightIcon={<IoSend color="white" size={16}/>}
                    text="SUBMIT"
                    onClick={() => {
                      submitFeedback(feedback, handleToast, displaySuccess)
                    }}
                  />
                </BottomBox>
              </>
            )}
          </Box>
        </>
      )}
      <FeedbackButton type='button' onClick={() => {
        handleVisible(!visible)
      }}>
        <BsChatLeftText color="white" size={18}/>
        FEEDBACK
      </FeedbackButton>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 2;

  `

const FeedbackButton = styled.div`
  width: min-content;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px 16px 24px;
  cursor: pointer;
  border-radius: 30px;
  background: #000;
  color: white;
  font-weight: 800;
  font-size: 10px;
  float: right;

  > svg {
    margin-right: 8px;
  }

  &:hover {
    opacity: 0.8;
  }
`

const Box = styled.div`
  box-sizing: border-box; 
  

  background: #F9F9F9;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  width: 327px;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 8px;

`

const BoxText = styled.p`
  font-size: 12px;
  font-weight: 400;
  padding-bottom: 12px;
`
const BottomBox = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
`

const Thanks = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
`