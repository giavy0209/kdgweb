import calAPI from '../axios'
import axios from 'axios'
import Home from '../pages/Home'
export const CHANGE_LOADING = 'CHANGE_LOADING';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
export const CHANGE_LIST_CATEGORIES = 'CHANGE_LIST_CATEGORIES';
export const CHANGE_CURRENT_URL = 'CHANGE_CURRENT_URL';
export const CHANGE_ROUTER = 'CHANGE_ROUTER';


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

export function actChangeRouter(router){
    return {
        type: CHANGE_ROUTER,
        payload: {router}
    }
}

export function actChangeSettings(settings){
    return {
        type: CHANGE_SETTINGS,
        payload: {settings}
    }
}

export function actChangeListCategories(categories){
    return {
        type: CHANGE_LIST_CATEGORIES,
        payload: {categories}
    }
}

export function asyncGetListCategories(){
    return async dispatch =>{
        try {
            var res = (await calAPI.get(`/categories`)).data
            dispatch(actChangeListCategories(res))
            const router = []
            res.forEach(el=>{
                var route = {
                    path: el.slug,
                    pathEN: el.slugEN,
                    exact: true,
                    name: el.name,
                    isShow: el.display,
                    render : Home,
                    page:  el.page,
                    name: {name_vi: el.name_vi, name_en: el.name_en},
                    id: el._id,
                    parent : el.parent,
                    isURL : el.isURL,
                }
                router.push(route)
            })
            console.log(router);
            dispatch(actChangeRouter(router))
            return  res
        } catch (error) {
            return  error
        }
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
