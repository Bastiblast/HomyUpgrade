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
import QueryPlaceholder from './query/QueryPlaceholder'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()


function App() {

  return (
    <div className='w-full h-full'>
    
        <PageTemplate>
        <div className="gap-4 grid md:grid-cols-3 auto-rows-min">
            <div className="bg-muted/50 rounded-xl aspect-video">
              <QueryClientProvider client={queryClient}>
                <QueryPlaceholder />
              </QueryClientProvider>
            </div>
            <div className="bg-muted/50 rounded-xl aspect-video">
              Hello
            </div>
          </div>
        
        </PageTemplate>


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
