import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(
  (() => {
    document.querySelector("html").style.height = '100%'
    document.body.style.height = '100%'
    const app = document.createElement('div')
    app.className = 'h-full transition-all'
    document.body.prepend(app)
    document.body.querySelector('a') ? (document.body.querySelector('a').style.display = 'none') : null
    return app
  })(),
).render(<App />)
