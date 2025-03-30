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
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}

