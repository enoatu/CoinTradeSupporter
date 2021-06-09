import 'babel-polyfill' //ないとasyncでエラー
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { DisplayBox } from './CommonStyle'
import config from './config'

const Display = (props) => {
  const [color, setColor] = useState([255, 255, 255])
  const [lastValue, setLastValue] = useState(null)

  const getLocalStorage = (val) => {
    return new Promise((resolve) => {
      chrome.storage.local.get(val, (result) => resolve(result[val]))
    })
  }
  useEffect(() => {
    if (!lastValue) {
      setTimeout(() => displayData(), 100)
      setInterval(() => displayData(), config.DISPLAY_INTERVAL)
    }
  })

  const displayData = () => {
    async function getJSON(val) {
      const items = await getLocalStorage(config.COIN_NAME)
      if (!items && !Array.isArray(items)) return []
      return items
    }
    getJSON().then((items) => {
      const item = items[items.length - 1]
      setLastValue(
        (item && item.data && item.data[0] && item.data[0].last) || 'エラー'
      )
      changeColor(items)
    })
  }

  const changeColor = (items) => {
    let lastValues = []
    // validation
    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i]
      if (item && item.data && item.data[0] && item.data[0].last != 0) {
        lastValues.push(item.data[0].last)
      }
    }
    let increaseRateSum = 0
    for (let i = 0, len = lastValues.length; i < len; i++) {
      if (i == len - 1) break
      increaseRateSum += (lastValues[i + 1] - lastValues[i]) / lastValues[i]
    }
    const increaseRate = increaseRateSum / (lastValues.length - 1)

    let red, green, blue, value
    if (increaseRate > 0) {
      // 0.0000001 < increaseRate < 0.01;
      // 0.0000001 * 255 * 100 < increaseRate * 255  * 100 < 0.01 * 255  * 100;
      // 0.0000001 * 255 * 100 < increaseRate * 255  * 100 < 0.01 * 255  * 100;
      // 0.00255 < increaseRate * 25500 <255
      // value = increaseRate * 255 - 1.55
      // /253.45

      red = 255
      green = 255 / (increaseRate * 25500)
      blue = 255 / (increaseRate * 25500)
    } else if (increaseRate < 0) {
      red = 255 / (-increaseRate * 25500)
      green = 255 / (-increaseRate * 25500)
      blue = 255
    } else {
      red = 255
      green = 255
      blue = 255
    }
    if (red > 255) red = 255
    if (red < 0) red = 0
    if (blue > 255) blue = 255
    if (blue < 0) blue = 0
    setColor([red, green, blue])
  }

  return (
    <DisplayBox
      bgColor={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
      color="#000"
    >
      <span>{lastValue}</span>
    </DisplayBox>
  )
}

class ErrorBoundary extends React.Component {
  state = { hasError: false }
  componetDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
  }
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  render() {
    return this.state.hasError ? <h1>拡張機能エラー</h1> : this.props.children
  }
}

const mainRoot = document.createElement('div')
mainRoot.setAttribute('id', 'coin-trade-supporter-display-box')
document.body.appendChild(mainRoot)
ReactDOM.render(
  <ErrorBoundary>
    <Display />
  </ErrorBoundary>,
  document.querySelector('#coin-trade-supporter-display-box')
)
