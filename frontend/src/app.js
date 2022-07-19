import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

class RApp extends React.Component {
  render() {
    return (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
}

class AppWebComponent extends HTMLElement {
  connectedCallback() {
    ReactDOM.render(<RApp />, this)
  }
}

customElements.define('react-element', AppWebComponent)
