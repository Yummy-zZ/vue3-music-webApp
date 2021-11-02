import axios from 'axios'

const ERR_OK = 0
const baseURL = process.env.NODE_ENV === 'production' ? 'http://120.25.222.227:8080/' : '/'
axios.defaults.baseURL = baseURL

export function get(url, params) {
  return axios.get(url, {
    params
  }).then((res) => {
    const serveData = res.data
    if (serveData.code === ERR_OK) {
      return serveData.result
    }
  }).catch(e => {
    console.log(e)
  })
}
