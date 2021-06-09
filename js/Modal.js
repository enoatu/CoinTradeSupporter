import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class Modal extends Component {
  constructor(props) {
    super(props)
    this.rootEl = document.getElementById('root')
  }
  render() {
    return ReactDOM.createPortal(
      <div
        style={{
          position: 'fixed',
          width: '100%',
          height: '100vmax',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          top: '0',
          overflow: 'scroll',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            width: '80%',
            margin: '10px auto',
          }}
        >
          {this.props.view}
          <div style={{ textAlign: 'right' }}>
            <button
              onClick={this.props.onClose}
              style={{
                border: '1px solid #9E9E9E',
                padding: '5px 10px',
                borderRadius: '3px',
              }}
            >
              close
            </button>
          </div>
        </div>
      </div>,
      this.rootEl
    )
  }
}

Modal.protoTypes = {
  onClose: PropTypes.func,
  view: PropTypes.func,
}

export default Modal
