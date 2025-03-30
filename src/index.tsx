import QueryPlaceholder from './query/QueryPlaceholder'

export default function Index() {
  return (
    <div className="gap-4 grid md:grid-cols-3 auto-rows-min">
    <div className="bg-muted/50 rounded-xl aspect-video">
        <QueryPlaceholder />
    </div>
    <div className="bg-muted/50 rounded-xl aspect-video">
      Hello
    </div>
  </div>
  )
}
