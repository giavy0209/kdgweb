import calAPI from '../axios'
import axios from 'axios'

export const CHANGE_LOADING = 'CHANGE_LOADING';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
export const CHANGE_CURRENT_URL = 'CHANGE_CURRENT_URL';


export function actChangeLoading(loading){
    return {
        type: CHANGE_LOADING,
        payload: {loading}
    }
}

export function atcChangeLanguage(lang){
    return{
        type:CHANGE_LANGUAGE,
        payload: {lang}
    }
}

export function actChangeCurrentUrl(url){
    return {
        type: CHANGE_CURRENT_URL,
        payload: {url}
    }
}

export function actChangeSettings(settings){
    return {
        type: CHANGE_SETTINGS,
        payload: {settings}
    }
}

export function asyncGetSettings(){
    return async dispatch =>{
        try {
            var res = (await calAPI.get(`/setting`)).data
            const setting = {}
            res.forEach(el=>{
                setting[el.key] = el.data
            })
            dispatch(actChangeSettings(setting))
            
            return  res
        } catch (error) {
            return  error
        }
    }
}



export function actChangeUser(user){
    return {
        type: CHANGE_SETTINGS,
        payload: {user}
    }
}

export function asyncLogin(submitData){
    return async dispatch =>{
        try {
            const res = ((await axios.post('http://171.244.18.130:6001/api/authorize',submitData)))
            dispatch(actChangeUser(res.data.data))
            return  {msg:'login success'}
        } catch (error) {
            return  {msg:'some error',error}
        }
    }
}
