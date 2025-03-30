import PageTemplate from './PageTemplate'
import './App.css'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { storeNavigation } from './store/storeNavigation'

const queryClient = new QueryClient()


function App() {

  const navigate = storeNavigation(s => s.navigate)
  
  return (
    <div className='w-full h-full'>
    
              <QueryClientProvider client={queryClient}>
        <PageTemplate>
          {navigate}
        </PageTemplate>
              </QueryClientProvider>


      <div className='left-20 absolute'>

      </div>
     <Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>



    </div>
  )
}

export default App
