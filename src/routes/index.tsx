import PlaceHolder from '@/query/queryPlaceHoldernew'
import QueryPlaceholder from '@/query/QueryPlaceholder'
import rootRoute from '@/routes/__root'
import { createRoute } from '@tanstack/react-router'

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <div className="gap-4 grid md:grid-cols-3 auto-rows-min">
      <div className="bg-muted/50 rounded-xl w-full h-full aspect-video">
      <PlaceHolder />
        </div>
      </div>
    )
  },
})

export default indexRoute