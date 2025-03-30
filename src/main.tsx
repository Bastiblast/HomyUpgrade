import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import { Link, Outlet, RouterProvider, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

// Import the generated route tree

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="flex gap-2 p-2">
        <Link to="/monkeyWhiteBoard" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/monkeyWhiteBoard/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/monkeyWhiteBoard/',
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    )
  },
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/monkeyWhiteBoard/about',
  component: function About() {
    return <div className="p-2">Hello from About!</div>
  },
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

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
