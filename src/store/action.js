import calAPI from '../axios'
import axios from 'axios'
import Home from '../pages/Home'
import Storage from '../helpers/storage'
export const CHANGE_LOADING = 'CHANGE_LOADING';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
export const CHANGE_LIST_CATEGORIES = 'CHANGE_LIST_CATEGORIES';
export const CHANGE_CURRENT_URL = 'CHANGE_CURRENT_URL';
export const CHANGE_ROUTER = 'CHANGE_ROUTER';
export const CHANG_USER_DATA = 'CHANG_USER_DATA';

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

export function actChangeUser(user){
    return {
        type: CHANG_USER_DATA,
        payload: {user}
    }
}

export function actChangeBalance(allBalance){
    return {
        type: CHANG_USER_DATA,
        payload: {allBalance}
    }
}


export function actChangeListContries(contries){
    return {
        type: CHANGE_SETTINGS,
        payload: {contries}
    }
}

export function asyncGetBalance(tron_kdg_wallet, eth_usdt_wallet){
    return async dispatch =>{
        const res = (await axios.get(`http://171.244.18.130:6001/api/eth_usdt/balance/${eth_usdt_wallet}`)).data
        const res2 = (await axios.get(`http://171.244.18.130:6001/api/tron_kdg/balance/${tron_kdg_wallet}`)).data
        const {eth_balance,usdt_balance} = res
        const {trx_balance,kdg_balance} = res2
        dispatch(actChangeBalance({eth_balance, usdt_balance, trx_balance,kdg_balance}))
    }
}

export function asyncLogin(submitData){
    return async dispatch =>{
        try {
            const res = ((await axios.post('http://171.244.18.130:6001/api/authorize',submitData)))
            dispatch(actChangeUser(res.data.data))
            dispatch(asyncGetBalance(res.data.data.trx_address, res.data.data.erc_address))
            Storage.setToken(res.data.data._id)
            return  {ok: true}
        } catch (error) {
            return  {ok:false}
        }
    }
}

export function asyncGetUserData(){
    return async dispatch =>{
        const token = Storage.getToken()
        if(token){
            try {
                const res = (await axios.get(`http://171.244.18.130:6001/api/user/${token}`))
                console.log(res.data.data);
                dispatch(actChangeUser(res.data.data))
                dispatch(asyncGetBalance(res.data.data.trx_address, res.data.data.erc_address))
                return  {msg:'login success'}
            } catch (error) {
                return  {msg:'some error',error}
            }
        }else{
            return false
        }
    }
}

export function asyncGetListContries(){
    return async dispatch =>{
        const res = (await axios.get('https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;flag')).data
        dispatch(actChangeListContries(res))
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
                    isShow: el.display,
                    render : Home,
                    page:  el.page,
                    name: {name_vi: el.name_vi, name_en: el.name_en},
                    id: el._id,
                    parent : el.parent,
                    isURL : el.isURL,
                    reqLogin : el.reqLogin,
                    type: el.type,
                }
                router.push(route)
            })
            console.log(router);
            dispatch(actChangeRouter(router))
            return  res
        } catch (error) {
            console.log(error);
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

export function asyncWithdraw(submitdata){
    return async dispatch =>{
        try {
            const res = (await axios.post(`http://171.244.18.130:6001/api/deposit`,submitdata)).data
            if(res.status === 1){
                dispatch(asyncGetUserData())
                return {msg:'success'}
            }else{
                return {msg:'error'}
            }
        } catch (error) {
            return {msg:'error', error}
        }

    }
}