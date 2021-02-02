import axios from 'axios'
import {storage} from './helpers'

const API_DOMAIN = "https://kdg-api.kingdomgame.co/api"

function create() {
    const jwt = storage.getToken()
    var Axios =  axios.create({
        baseURL : API_DOMAIN,
        headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${jwt}`,
        }
    });
    return Axios
}

export const refreshToken =async (method , url , body) => {
    const refreshToken = storage.getRefresh()
    if(!refreshToken) {
      return {status : 0}
    }

    try {
      const res = await callAPI.post('/refresh' , {refresh_token : refreshToken})
      if(res.status === 1){
        if(method && url){
          storage.setRefresh(res.refreshToken)
          storage.setToken(res.jwt)
          return (await callAPI[method](url, body , false))
        }

        return {status : 1}
  
      }
      if(res.status === 402) {
        storage.clearRefresh()
        storage.clearToken()
        return {status : 0}
      }
    } catch (error) {
      console.log(error);
      return {status : 0}
    }

}

const callAPI = {
    get : async (url,body , reget = true) => {
      var res = (await create().get(url)).data
      if(res.status === 401) {
        if(reget){
          return (await refreshToken('get', url))
        }
        storage.clearRefresh()
        storage.clearToken()
        return {status : 0}
      }
      return res
    },
    post : async (url, body, reget = true) => {
      var res = (await create().post(url,body)).data
      if(res.status === 401) {
        if(reget){
          return (await refreshToken('post', url,body))
        }
        storage.clearRefresh()
        storage.clearToken()
        return {status : 0}
      }
      return res
    },
    put : async (url, body, reget = true) => {
      var res = (await create().put(url,body)).data

      if(res.status === 401) {
        
        if(reget){
          return (await refreshToken('put', url,body))
        }
        storage.clearRefresh()
        storage.clearToken()
        return {status : 0}
      }

      return res
    },
}

export default callAPI