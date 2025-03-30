import rootRoute from '@/routes/__root'
import { createRoute } from '@tanstack/react-router'

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {
    return (
      <div>What about ?</div>
    )
  },
})

export default aboutRoute