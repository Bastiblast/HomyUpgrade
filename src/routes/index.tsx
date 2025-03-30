import QueryPlaceholder from '@/query/QueryPlaceholder'
import rootRoute from '@/routes/__root'
import { createRoute } from '@tanstack/react-router'

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <QueryPlaceholder/>
    )
  },
})

export default indexRoute