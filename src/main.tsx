import './index.css'
import { createRoot } from 'react-dom/client'
import { createHashHistory,RouterProvider, createRouter } from '@tanstack/react-router'
import {GM_addElement} from '$'
// Import the generated route tree
import rootRoute from '@/routes/__root'
import indexRoute from '@/routes/index'
import aboutRoute from '@/routes/about'
import React from 'react'
import ReactDOM from 'react-dom'

GM_addElement(document.body, "script", {innerHTML: React })
GM_addElement(document.body, "script", {innerHTML: ReactDOM })

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const hashHistory = createHashHistory()

const router = createRouter({ routeTree, history: hashHistory })

const newBody = document.createElement("section")

document.body.style.display = "none"

document.querySelector("html")?.prepend(newBody)

createRoot(
  (() => {
    const app = document.createElement('div');
    newBody.append(app);
    return app;
  })(),
).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

export {rootRoute}