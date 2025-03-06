import axios from 'axios'
import router from '../router'
import { Store } from '../stores'

axios.defaults.baseURL = `http://155.159.255.140:3000/api/`

export default async function http(obj) {
  const paramsData = { ...obj.data }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    method: obj.type.toUpperCase(),
    url: obj.url,
    data: paramsData,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const store = Store()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = null
  if (store && store.token) {
    params.headers.AccessToken = store.token
  }
  await axios({ ...params })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status != 401) {
          data = {
            type: 'error',
            message: error.response.data.message,
          }
        } else if (error.response.status == 401) {
          router.push({ name: 'Login' })
        }
      }
    })
  return data
}
