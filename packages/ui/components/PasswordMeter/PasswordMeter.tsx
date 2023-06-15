import { FunctionComponent } from "react";
import styled from 'styled-components'

interface Props {
  score?: number;
}

const scores = {
  0: {
    text: 'Weak',
    color: '#BF2E1F'
  },
  1: {
    text: 'Weak',
    color: '#BF2E1F'
  },
  2: {
    text: 'Medium',
    color: '#F8D145'
  },
  3: {
    text: 'Strong',
    color: '#58D347'
  },
  4: {
    text: 'Very strong',
    color: '#58D347'
  },
}

const PasswordMeter: FunctionComponent<React.PropsWithChildren<Props>> = ({ score }) => {
  console.log(score)
  return (
    <div>
      <Wrapper>
        <Bar color={scores[score].color} selected={score >= 1 || score === 0}/>
        <Bar color={scores[score].color} selected={score >= 2}/>
        <Bar color={scores[score].color} selected={score >= 3}/>
        <Bar color={scores[score].color} selected={score == 4}/>
      </Wrapper>
      <Text>
        password strength: {scores[score].text}
      </Text>
      
    </div>
  )
}

const Wrapper = styled.div`
  display: flex;
  margin: 8px 0;
`
const Bar = styled.div<{ color: string }>`
  width: 25%;
  margin-right: 8px;
  height: 5px;
  background-color: ${({ color, selected }) => selected ? color : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 4px;
`

const Text = styled.div`
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
`
export default PasswordMeter