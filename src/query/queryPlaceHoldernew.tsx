import TanstackTable from '@/components/TanstackTable'
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
  } from '@tanstack/react-query'
  
  const queryClient = new QueryClient()
  
  export default function PlaceHolder() {
    return (
      <QueryClientProvider client={queryClient}>
        <Example />
      </QueryClientProvider>
    )
  }

  function Render ({data}) {
    return (<div>
    <h1>{data.name}</h1>
    <p>{data.description}</p>
    <strong>👀 {data.subscribers_count}</strong>{' '}
    <strong>✨ {data.stargazers_count}</strong>{' '}
    <strong>🍴 {data.forks_count}</strong>
  </div>)
  }
  
  function Example() {
    const { isPending, error, data } = useQuery({
      queryKey: ['repoData'],
      queryFn: () =>
        fetch('https://jsonplaceholder.typicode.com/todos/')
        .then((res) =>res.json(),
      ),
    })
    
    if (isPending) return 'Loading...'
    
    if (error) return 'An error has occurred: ' + error.message
    
    const validData = testingData (data)

    return null
  }

  interface placeholderObject {
    "userId": number,
    "id": number,
    "title": string,
    "completed": boolean
}

  function testingData (data: Array<placeholderObject>): placeholderObject  {

    console.log("placeholder data ",data)
    
    const validArray = data.filter(object => {
      console.log(typeof object.completed,typeof object.completed === "boolean")
      return (typeof object.completed === "boolean") 
      && (typeof object.userId === "number")
      && (typeof object.title === "string")
      && (typeof object.id === "number")
    })

    console.log("placeholder validData injected ",validArray)

    return validArray
    queryClient.invalidateQueries()
  }