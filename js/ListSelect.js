import React, { Component } from 'react'

export default class ListSelect extends Component {
  constructor() {
    super()
    this.state = {
      selectedOption: null,
      options: [],
    }
    this.getOptions = this.getOptions.bind(this)
  }

  componentDidMount() {
    this.setState({ options: this.getOptions() })
  }

  handleChange(option) {
    this.setState({ selectedOption: option })
    console.log(`Option selected:`, option)
  }

  updateKid(state) {
    this.setState({ selectedOption: state })
    this.props.updateState({ kid: state })
  }

  getOptions() {
    const kinds = this.props.kinds
    let options = []
    options.push({ value: 'nokind', label: '-', color: 'rgba(51,41,41,1)' })
    for (const kid in kinds) {
      options.push({
        value: kid,
        label: kinds[kid].text,
        color: kinds[kid].color,
      })
    }
    return options
  }

  render() {
    const options = this.getOptions()
    return (
      <div style={{ display: 'inline-block', margin: 5 }}>
        <select
          defaultValue="nokind"
          onChange={(e) => this.updateKid(e.target.value)}
          width="100%"
          style={{
            height: '25px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '3px 5px',
            backgroundColor: '#fff',
            color: '#333',
            fontSize: 16,
          }}
        >
          {options.map((d, index) => (
            <option value={d.value} key={index}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
}
