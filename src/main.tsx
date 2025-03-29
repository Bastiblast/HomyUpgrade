import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'

// document.body.style.display = "none"

const newBody = document.createElement("section")

document.querySelector("html")?.prepend(newBody)

createRoot(
  (() => {
    const app = document.createElement('div');
    newBody.append(app);
    return app;
  })(),
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
