import PageTemplate from '@/PageTemplate'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router'

const queryClient = new QueryClient()

const rootRoute = createRootRoute({
  component: () => (
    <>
        <PageTemplate>
          <QueryClientProvider client={queryClient} >

           <Outlet />
          </QueryClientProvider>
        </PageTemplate>

    </>
  ),
})

export default rootRoute