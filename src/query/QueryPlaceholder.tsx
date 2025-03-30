import { useQuery } from '@tanstack/react-query'

interface json {
  "userId": number,
  "id": number,
  "title": string,
  "completed": boolean
}

const fetchTodoList = (): Promise<json[]> => fetch('https://jsonplaceholder.typicode.com/todos/')
.then(response => response.json())

export default function QueryPlaceholder() {
  const {isPending,isError,data,error}= useQuery({ queryKey: ['todos'], queryFn: fetchTodoList })
  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <div className="gap-4 grid md:grid-cols-3 auto-rows-min">
    <div className="bg-muted/50 rounded-xl aspect-video">
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
    </div>
    <div className="bg-muted/50 rounded-xl aspect-video">
      Hello
    </div>
  </div>

  )
}

