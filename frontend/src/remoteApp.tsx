import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

export default (el: HTMLElement) => {
  console.log('REMOTE APP LOADING ..')

  const root = ReactDOM.createRoot(el)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  // ReactDOM.render(<App></App>, el as HTMLElement)
}
