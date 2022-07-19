import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

export default (el: HTMLElement) => {
  console.log('REACT APP CALLED')
  const mfRoot = ReactDOM.createRoot(el as HTMLElement)
  mfRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

// function App() {
//   return (
//     <div id="acoustic-rating-app">
//       <AppHome></AppHome>
//     </div>
//   )
// }

// export default App
