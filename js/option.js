import 'babel-polyfill' //ないとasyncでエラー
import React from 'react'
import ReactDOM from 'react-dom'
import Master from './master'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

const GlobalStyle = createGlobalStyle`
  ${reset}
`

ReactDOM.render(
  <React.Fragment>
    <GlobalStyle />
    <Master />
  </React.Fragment>,
  document.querySelector('#root')
)
