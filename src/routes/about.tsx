import GMqueryTemplate from '@/query/GMqueryTemplate'
import useGMQuery from '@/query/useGMQuery'
import rootRoute from '@/routes/__root'
import { createRoute } from '@tanstack/react-router'

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {


    return (
      <>
      <GMqueryTemplate />

    
      </>

    )
  },
})

export default aboutRoute