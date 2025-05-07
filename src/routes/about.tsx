import MonkeyFunctionComponent from '@/query/MonkeyFunctionComponent'
import rootRoute from '@/routes/__root'
import { createRoute } from '@tanstack/react-router'

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {


    return (
      <>
      <MonkeyFunctionComponent />

    
      </>

    )
  },
})

export default aboutRoute