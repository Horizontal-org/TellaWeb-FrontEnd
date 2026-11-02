import { FunctionComponent } from "react"

const MediaLoader: FunctionComponent = () => (
  <div
    aria-busy
    className="w-full bg-gray-100  animate-pulse"
    style={{ height: 'calc(40vw / 1.35)' }}
  />
)

export default MediaLoader
