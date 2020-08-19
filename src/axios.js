import axios from "axios";

import {API_DOMAIN} from './constant'

const api = axios.create({
    baseURL: API_DOMAIN,
    headers: {
      // 'Authorization': 'Bearer my-token',
    }
});

const calAPI = {
  post: async (route, object)=>{
    var data = await api.post(route, object)
    return data
  },
  put: async (route, object)=>{
    var data = await api.put(route, object)
    return data
  },
  get: async (route)=>{
    var data = await api.get(route)
    return data
  },
  delete: async (route)=>{
    var data = await api.delete(route)
    return data
  },
}

export default calAPI