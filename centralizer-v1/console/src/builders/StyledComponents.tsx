import styled from "styled-components";



export  const StepperItem = styled.div<{ showStep: boolean }>`
  display:  ${(props)=>props.showStep ?  'block' : 'none'};
  
`
export const ShowDiv = styled.div<{show: boolean}>`
  display:  ${(props)=>props.show ?  'block' : 'none'};
`