import { useEffect, useRef, useState } from 'react'
import { GM, GM_getValue, GM_setValue } from 'vite-plugin-monkey/dist/client'
import { env } from '../../env'
import { GmAsyncXmlhttpRequestReturnType } from '$'

interface MonkeyQueryProps {
  name: string
  urls: string[]
  mutationFn?: (responseText: string) => unknown
  latence?: number
  refresh?: true | false | number
}

interface progress {
  prev: number
  next: number
}

export interface GMQueryResponse {
  status: string | 'wait' | 'start' | 'load' | 'abort' | 'error' | 'success' | 'completed' | 'standby'
  errorMessage?: string | null
  stamp?: number
  loading: boolean
  progress?: progress | null
  lifeTime?: number | null
  datas?: null | string
}
;[]

const initializeMonkeyResponse = {
  datas: null,
  stamp: Date.now(),
  errorMessage: null,
  loading: true,
  progress: null,
  lifeTime: null,
} as GMQueryResponse

export default function useMonkeyQuery({ name, urls, latence = 0, refresh = false, mutationFn }: MonkeyQueryProps) {
  const [response, setResponse] = useState<GMQueryResponse>()
  const [loading, setLoading] = useState<boolean>()
  const [status, setStatus] = useState<string>()
  const [error, setError] = useState<string[]>()
  const [datas, setDatas] = useState<unknown[]>()

  const stamp = useRef(Date.now())
  const lifeTime = useRef(0)

  const refreshTime = typeof refresh === 'number' ? refresh : 60000

  const isOutDated = (): boolean => {
    return Date.now() - stamp.current > refreshTime
  }

  const progressPercent = (): number | undefined => {
    const progress = Math.round(((Date.now() - stamp.current) / refreshTime) * 100)
    return progress ? progress : 0
  }

  useEffect(() => {
    lifeTime.current = Date.now() - stamp.current
    const newResponse = { status, stamp: stamp.current, datas, logError: error, lifeTime: lifeTime.current }
    console.log({ newResponse })
    setResponse(newResponse)
  }, [status, datas, error])

  useEffect(() => {
    if (!refresh || status === 'loading' || status === 'fetching' || status === 'making') return

    const timer = setInterval(() => {
      console.log('refreshing query')
      lifeTime.current = Date.now() - stamp.current
      if (isError(datas) || isOutDated()) {
        console.log('data need to be fetch')
        get()
      } else {
        setStatus('standby')
        setResponse({
          ...response,
          lifeTime: lifeTime.current,
          status: 'standby',
        })
      }
    }, 3000)

    return () => clearInterval(timer)
  })
  const isError = (datas) => datas && datas.find((data) => data.status === 'error')

  const color = (): string => {
    const invalidState = ['error']
    if (!status || invalidState.includes(status)) return 'bg-red-500'
    const validState = ['completed', 'standby']
    if (validState.includes(status)) return 'bg-green-500'
    const loadState = ['start', 'load', 'success']
    if (loadState.includes(status) || !progressPercent()) return 'bg-blue-500 animate-pulse'

    if (progressPercent() < 100) return 'bg-green-500'
    if (progressPercent() < 150) return 'bg-amber-600'
    else return 'bg-red-500'
  }

  async function virtualize() {
    console.log('useQuery getting dev')
    const mutation = urls.map((url) => (mutationFn ? mutationFn(url) : url))
    const newDatas = await Promise.all(mutation)
    const datas = newDatas.map((data) => {
      return {
        status: 'completed',
        data: data,
        errorMessage: '',
      }
    })
    setDatas(datas)
    console.log('injecting datas', newDatas)
    console.log('is mutation ?')
    setStatus('completed')
    stamp.current = Date.now()
    setLoading(false)
  }

  async function get() {
    if (status === 'fetching') return
    setLoading(true)
    setStatus('fetching')

    let queries, responses, statusHandler

    switch (env) {
      case 'developpement':
        statusHandler = urls
        break
      case 'production':
        queries = urls.map((url) =>
          GM.xmlHttpRequest({
            method: 'GET',
            url: url,
          }),
        )
        responses = await Promise.all(queries)
        console.log({ responses })
        statusHandler = responses.map((resp) => queryHandler(resp))
    }

    console.log({ statusHandler })
    setStatus('making')

    const datas = statusHandler.map((response) => makeResponse(response))

    const makes = await Promise.all(datas)
    console.log({ makes })
    setDatas(makes)
    setStatus(isError(makes) ? 'error' : 'completed')
    stamp.current = Date.now()
    setLoading(false)
  }

  const queryHandler = (resp: GmAsyncXmlhttpRequestReturnType<'text', unknown>) => {
    console.log({ resp })
    if (resp.status !== 200) {
      const time = new Date().toTimeString().slice(0, 8)
      const errorMessage = `${time} = server respond with ${resp.status} error status from "${resp.finalUrl}"`
      const addError = Array.isArray(error) && error.length > 0 ? [...error, errorMessage] : [errorMessage]
      setError(addError)
      setStatus('error')

      return errorMessage
    } else {
      return resp.responseText
    }
  }

  /*
	function ProgressBar() {
		return (
			<ProgressAnimationDemo
				color={color()}
				duration={`transition duration-1000`}
				className="h-4"
				value={response.progress}
			/>
		);
	}
*/
  function Alert() {
    return <div className={color() + ' h-6 w-6 rounded-full p-2'}></div>
  }

  async function makeResponse(responseText: any) {
    console.log('make response ', responseText)

    console.log('query monkey with text, is mutation ? ', mutationFn ? true : false)
    const data = mutationFn ? await mutationFn(responseText) : responseText
    console.log('data ', data)
    const isMutationError = typeof data === 'string' && data.includes('error') ? true : false
    console.log('data ', data, isMutationError)
    switch (isMutationError) {
      case true:
        return {
          status: 'error',
          data: data,
          errorMessage: 'mutation error',
        }
      case false:
        return {
          status: 'completed',
          data: data,
          errorMessage: '',
        }
    }
    return {
      status: 'completed',
      data: data,
      errorMessage: '',
    }
  }

  return { response, get, Alert, loading }
}
