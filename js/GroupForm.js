import React, { Component } from 'react'
import 'babel-polyfill' //ないとasyncでエラー
import styled from 'styled-components'
import { Button, InputText } from './CommonStyle'

export default class GroupForm extends Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }

    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleClick(event) {
    const value = this.state.value
    if (!value) return alert('Please enter the group name')
    this.props.save('group', { name: value })
    this.setState({ value: '' })
    event.preventDefault()
  }

  updateState(state) {
    this.setState(state)
    this.props.updateState(state)
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <InputText
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="Group Name"
        />
        <CreateButton onClick={this.handleClick}>Add</CreateButton>
      </div>
    )
  }
}

const CreateButton = styled(Button)`
  width: 100px;
  height: 30px;
  margin: 5px;
`
