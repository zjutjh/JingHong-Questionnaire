import axios, { type AxiosRequestConfig } from 'axios'

// axios.defaults.withCredentials = true;
//自动存储cookie

const axiosInstance = axios.create({
  baseURL: "https://phlin.top",
  timeout: 10000,
  withCredentials: true
})

axiosInstance.defaults.withCredentials = true;

const request = <ResponseType = unknown>(
  url: string,
  options?: AxiosRequestConfig<unknown>,
): Promise<ResponseType> => {
  return new Promise((resolve, reject) => {
    axiosInstance({
      url,
      ...options,
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => reject(err))
  })
}
export { axiosInstance, request }
