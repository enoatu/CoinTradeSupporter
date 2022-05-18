import styled from 'styled-components'
export const DisplayBox = styled.div`
  &&& {
    font-family: arial;
    background-color: ${(props) => props.bgColor};
    position: fixed;
    left: 20px;
    top: 90%;
    width: 10px;
    min-height: 60px;
    z-index: 999999999;
    writing-mode: vertical-rl;
    cursor: pointer;
    text-align: center;
    font-size: 10px;
    line-height: normal;
    color: ${(props) => props.color || '#000'};
    padding: 3px;
    transform: translate(-50%, -50%);
    opacity: 0;
    :hover {
      opacity: 1;
    }
  }
`
