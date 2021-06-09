import React, { Component } from 'react'
import 'babel-polyfill' //ないとasyncでエラー
import reactCSS from 'reactcss'
import ListSelect from './ListSelect'
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

export default class UrlForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gid: this.props.gid,
      kid: 'nokind',
      url: '',
      reg: false,
      selectedOption: null,
      displayBgColorPicker: false,
      displayColorPicker: false,
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
      text: '',
      urls: this.props.urls,
    }
  }

  handleUrlChange = (event) => {
    this.setState({ url: event.target.value })
  }

  handleTextChange = (event) => {
    this.setState({ text: event.target.value })
  }

  getOrder = (gid) => {
    const urls = this.state.urls
    let preOrder = -1
    Object.keys(urls).map((uid) => {
      if (urls[uid].gid != gid) return
      if (preOrder < urls[uid].order) preOrder = urls[uid].order
    })
    return preOrder + 1
  }

  handleClick = (event) => {
    if (!this.state.url) return alert('Please enter the URL text')
    if (
      !this.state.reg &&
      !/https:\/\//.test(this.state.url) &&
      !/https:\/\//.test(this.state.url)
    )
      return alert("Please Start with 'http://' or 'https://'")
    if (this.state.kid == 'nokind') {
      const bgColor = this.rgbaToString(this.state.bgColor)
      const color = this.rgbaToString(this.state.color)
      if (!bgColor) return alert('This is invalid color')
      if (!color) return alert('This is invalid color')
      this.props.save('url', {
        gid: this.state.gid,
        kid: this.state.kid,
        url: this.state.url,
        reg: this.state.reg,
        color: color,
        bgColor: bgColor,
        text: this.state.text,
        order: this.getOrder(this.state.gid),
      })
      this.props.save('kind', {
        text: this.state.text,
        bgColor: bgColor,
        color: color,
      })
    } else {
      this.props.save('url', {
        gid: this.state.gid,
        kid: this.state.kid,
        url: this.state.url,
        reg: this.state.reg,
        order: this.getOrder(this.state.gid),
      })
    }
    event.preventDefault()
  }

  updateState(state) {
    console.log('state')
    this.setState(state)
    //親コンポーネントを更新
    //  this.props.updateState(state);
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
        <Options>
          <Label>Regular Expression:</Label>
          <label>
            {' '}
            off
            <input
              type="radio"
              checked={this.state.reg === false}
              onChange={() => this.setState({ reg: false })}
            />
          </label>
          <label>
            {' '}
            on
            <input
              type="radio"
              checked={this.state.reg === true}
              onChange={() => this.setState({ reg: true })}
            />
          </label>
        </Options>
        {this.state.kid == 'nokind' ? (
          <DisplayBox
            bgColor={this.rgbaToString(this.state.bgColor)}
            color={this.rgbaToString(this.state.color)}
          >
            {this.state.text}
          </DisplayBox>
        ) : (
          <DisplayBox
            bgColor={this.props.kinds[this.state.kid].bgColor}
            color={this.props.kinds[this.state.kid].color}
          >
            {this.props.kinds[this.state.kid].text}
          </DisplayBox>
        )}
        <Options>
          <Label>URL:</Label>
          <InputText
            type="text"
            value={this.state.url}
            onChange={this.handleUrlChange}
            placeholder={
              this.state.reg
                ? 'https?://[a-z]{3}.google.*'
                : 'https://example.com'
            }
          />
        </Options>
        <Options>
          <Label>Text and Color:</Label>
          <ListSelect
            kinds={this.props.kinds}
            updateState={this.updateState.bind(this)}
          />
        </Options>
        {this.state.kid == 'nokind' && (
          <div>
            <Options>
              <Label>Text For Displaying:</Label>
              <InputText
                type="text"
                value={this.state.text}
                onChange={this.handleTextChange}
              />
            </Options>
            <Options>
              <Label>BackGround Color: </Label>
              <Swatch onClick={this.handleBgPickerClick}>
                <div style={styles.bgColor}></div>
              </Swatch>
              {this.state.displayBgColorPicker ? (
                <Popover>
                  <Cover onClick={this.handleBgPickerClose}></Cover>
                  <SketchPicker
                    color={this.state.bgColor}
                    onChange={this.handleBgPickerChange}
                  />
                </Popover>
              ) : null}
            </Options>
            <Options>
              <Label>Text Color: </Label>
              <Swatch onClick={this.handlePickerClick}>
                <div style={styles.color}></div>
              </Swatch>
              {this.state.displayColorPicker ? (
                <Popover>
                  <Cover onClick={this.handlePickerClose}></Cover>
                  <SketchPicker
                    color={this.state.color}
                    onChange={this.handlePickerChange}
                  />
                </Popover>
              ) : null}
            </Options>
          </div>
        )}
        <div style={{ textAlign: 'right', margin: '10px 0' }}>
          <CreateButton onClick={this.handleClick}>create</CreateButton>
        </div>
      </div>
    )
  }
}
