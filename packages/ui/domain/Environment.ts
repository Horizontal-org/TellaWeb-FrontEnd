export interface Environment {
  latitude?: number
  longitude?: number
  altitude?: number
  accuracy?: number
  timestamp?: number
  locationProvider?: string
  speed?: number
  temperature?: number
  light?: number
  cellInfo?: number[]
  wifiInfo?: string[]
}
