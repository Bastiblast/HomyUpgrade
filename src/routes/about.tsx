import MonkeyFunctionComponent from '@/query/MonkeyFunctionComponent'
import rootRoute from '@/routes/__root'
import { createRoute } from '@tanstack/react-router'

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {


    return (
      <>
      <div className='items-stretch grid grid-cols-2'>

      <MonkeyFunctionComponent refresh={20000} url={'https://jsonplaceholder.typicode.com/todos/1'}/>
      <MonkeyFunctionComponent refresh={25000} url={'https://jsonplaceholder.typicode.com/posts/1'}/>
      <MonkeyFunctionComponent refresh={30000} url={'https://jsonplaceholder.typicode.com/albums/1'}/>
      <MonkeyFunctionComponent refresh={35000} url={'https://jsonplaceholder.typicode.com/users/1'}/>
      </div>

    
      </>

    )
  },
})

export default aboutRoute