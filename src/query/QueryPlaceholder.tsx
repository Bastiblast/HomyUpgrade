import { useQuery } from '@tanstack/react-query'
import {GM} from 'vite-plugin-monkey/dist/client'

interface json {
  "userId": number,
  "id": number,
  "title": string,
  "completed": boolean
}

const fetchTodoList = async (): Promise<json[]> => {
  const response = await GM.xmlHttpRequest({
    method:"GET",
    url:'https://jsonplaceholder.typicode.com/todos/',
    responseType:"json",
    onload: function(response) {
    console.log("GM http request onload : ",response)
    return response.responseText}
  })
  const json = JSON.parse(response.responseText)
  console.log(json)
  return !json.length ? [json] : json
}

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
      {data.map((todo,index) => (
        <li key={index}>{todo.title}</li>
      ))}
    </ul>


  )
}

