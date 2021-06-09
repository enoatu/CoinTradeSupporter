import React, { Component } from 'react'
import 'babel-polyfill' //ないとasyncでエラー
import reactCSS from 'reactcss'
import {
  InputText,
  Label,
  Options,
  DisplayBox,
  Swatch,
  Popover,
  Cover,
  CreateButton,
} from './CommonStyle'
import { SketchPicker } from 'react-color'

export default class KindForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      bgColor: {
        r: 1,
        g: 51,
        b: 59,
        a: 51,
      },
      color: {
        r: 241,
        g: 112,
        b: 19,
        a: 1,
      },
      displayBgColorPicker: false,
      displayColorPicker: false,
    }
  }

  handleTextChange = (event) => {
    this.setState({ text: event.target.value })
  }

  handleClick = (event) => {
    const displayText = this.state.text
    const bgColor = this.rgbaToString(this.state.bgColor)
    const color = this.rgbaToString(this.state.color)
    if (!displayText) return alert('Please enter the text for displaying')
    if (!bgColor) return alert('This is invalid color')
    if (!color) return alert('This is invalid color')
    this.props.save('kind', {
      text: displayText,
      bgColor: bgColor,
      color: color,
    })
    event.preventDefault()
  }

  updateState(state) {
    this.setState(state)
    this.props.updateState(state)
  }

  rgbaToString(rgba) {
    if (
      rgba.r === undefined ||
      rgba.g === undefined ||
      rgba.b === undefined ||
      rgba.a === undefined
    )
      return
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`
  }

  handleBgPickerClick = () => {
    this.setState({ displayBgColorPicker: !this.state.displayBgColorPicker })
  }

  handleBgPickerClose = () => {
    this.setState({ displayBgColorPicker: false })
  }

  handleBgPickerChange = (color) => {
    this.setState({ bgColor: color.rgb })
  }

  handlePickerClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  handlePickerClose = () => {
    this.setState({ displayColorPicker: false })
  }

  handlePickerChange = (color) => {
    this.setState({ color: color.rgb })
  }

  render() {
    const styles = reactCSS({
      default: {
        bgColor: {
          width: '40px',
          height: '20px',
          borderRadius: '3px',
          background: `rgba(${this.state.bgColor.r}, ${this.state.bgColor.g}, ${this.state.bgColor.b}, ${this.state.bgColor.a})`,
        },
        color: {
          width: '40px',
          height: '20px',
          borderRadius: '3px',
          background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`,
        },
      },
    })
    return (
      <div>
        <DisplayBox
          bgColor={this.rgbaToString(this.state.bgColor)}
          color={this.rgbaToString(this.state.color)}
        >
          {this.state.text}
        </DisplayBox>
        <Options>
          Text For Displaying:
          <InputText
            type="text"
            value={this.state.text}
            onChange={(e) => this.handleTextChange(e)}
          />
        </Options>
        <Options>
          <Label>Background Color: </Label>
          <Swatch onClick={this.handleBgPickerClick}>
            <div style={styles.bgColor}></div>
          </Swatch>
        </Options>
        {this.state.displayBgColorPicker ? (
          <Popover>
            <Cover onClick={this.handleBgPickerClose}></Cover>
            <SketchPicker
              color={this.state.bgColor}
              onChange={this.handleBgPickerChange}
            />
          </Popover>
        ) : null}
        <Options>
          <Label>Text Color: </Label>
          <Swatch onClick={this.handlePickerClick}>
            <div style={styles.color}></div>
          </Swatch>
        </Options>
        {this.state.displayColorPicker ? (
          <Popover>
            <Cover onClick={this.handlePickerClose}></Cover>
            <SketchPicker
              color={this.state.color}
              onChange={this.handlePickerChange}
            />
          </Popover>
        ) : null}
        <div style={{ textAlign: 'right', margin: '10px 0' }}>
          <CreateButton onClick={this.handleClick}>create</CreateButton>
        </div>
      </div>
    )
  }
}
