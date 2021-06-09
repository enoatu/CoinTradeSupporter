import styled from 'styled-components'
export const InputText = styled.input`
  margin: 5px;
  min-width: 250px;
  font-size: 18px;
`

export const Label = styled.span`
  margin: 5px;
  color: #1b435d;
`

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

export const Button = styled.button`
  font-size: 15px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-width: 150px;
  border-radius: 20px;
  padding: 5px;
  margin-top: 10px;
  border: 1px solid #707070;
  line-height: 18px;
  height: 30px;
  &:hover {
    opacity: 0.7;
  }
`

export const ButtonInline = styled.button`
  display: inline-block;
  cursor: pointer;
  hover {
    opacity: 0.7;
  }
`

export const Options = styled.div`
  margin-bottom: 20px;
`

export const Swatch = styled.div`
  background: #fff;
  display: inline-block;
  cursor: pointer;
  vertical-align: middle;
  padding-bottom: 2px;
`

export const Popover = styled.div`
  position: absolute;
  zindex: 2;
`

export const Cover = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

export const CreateButton = styled.button`
  background-color: #6200ee;
  color: #fff;
  border-style: none;
  padding: 5px 10px;
  border-radius: 3px;
  width: 50px;
  height: 25px;
`
