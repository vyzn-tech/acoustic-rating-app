import React from 'react'
import ReactDOM from 'react-dom/client'
import { loadConfiguration } from 'app.config'

import App from './App'

const renderApplication = (rootEl: HTMLElement) => {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

export const mount = (el: HTMLElement, config: any) => {
  console.info('REMOTE ACOUSTIC RATING APP LOADING ..', config)

  loadConfiguration(config)
  renderApplication(el)
}
