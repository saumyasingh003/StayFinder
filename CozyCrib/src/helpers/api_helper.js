import axios from "axios"
import Cookies from "js-cookie";

const token = Cookies.get('token');

// const API_URL = "http://178.16.138.144:4000/api"
// const API_URL = "http://localhost:4000/api"
const API_URL = "http://localhost:8000"
const axiosApi = axios.create({
  baseURL: API_URL,
})

axiosApi.defaults.headers.common["Authorization"] = "Bearer "+ token

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export async function get(url,params, config = {}) {

  if (params) {
    var queryString = params
        ? Object.keys(params)
              .map((key) => key + '=' + params[key])
              .join('&')
        : '';
    return  axiosApi.get(`${url}?${queryString}`, {...config}).then(response => response.data);
} else {
   return  axiosApi.get(`${url}`,{...config}).then(response => response.data);
}
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
    .catch(err=>err.response)
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}
