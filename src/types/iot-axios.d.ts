import axios from 'axios'

declare module 'axios' {
  export interface AxiosResponse<T = any> {
    code: number
    msg: string
    message: string
    rows?: T
    data?: T
    total: number
  }
}
