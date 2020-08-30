import callapi from '../axios'
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
        const res = (await callapi.get(`/api/eth_usdt/balance/${eth_usdt_wallet}`)).data
        const res2 = (await callapi.get(`/api/tron_kdg/balance/${tron_kdg_wallet}`)).data
        const {eth_balance,usdt_balance} = res
        const {trx_balance,kdg_balance} = res2
        dispatch(actChangeBalance({eth_balance, usdt_balance, trx_balance,kdg_balance}))

        setInterval(async() => {
            const res = (await callapi.get(`/api/eth_usdt/balance/${eth_usdt_wallet}`)).data
            const res2 = (await callapi.get(`/api/tron_kdg/balance/${tron_kdg_wallet}`)).data
            const {eth_balance,usdt_balance} = res
            const {trx_balance,kdg_balance} = res2
            dispatch(actChangeBalance({eth_balance, usdt_balance, trx_balance,kdg_balance}))
        }, 10000);
    }
}

export function asyncLogin(submitData){
    return async dispatch =>{
        try {
            dispatch(actChangeLoading(true))
            const res = ((await callapi.post('/api/authorize',submitData)))
            console.log(res);
            dispatch(actChangeUser(res.data.data))
            dispatch(asyncGetBalance(res.data.data.trx_address, res.data.data.erc_address))
            Storage.setToken(res.data.data._id)
            dispatch(actChangeLoading(false))
            return  {ok: true}
        } catch (error) {
            console.log(error.response);
            dispatch(actChangeLoading(false))
            return  {ok:false}
        }
    }
}

export function asyncGetUserData(){
    return async dispatch =>{
        const token = Storage.getToken()
        if(token){
            try {
                const res = (await callapi.get(`/api/user/${token}`)).data
                console.log(res);
                if(res.status === 1){
                    dispatch(actChangeUser(res.data))
                    dispatch(asyncGetBalance(res.data.trx_address, res.data.erc_address))
                }else{
                    Storage.clearToken()
                }
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
        dispatch(actChangeLoading(true))
        const res = (await callapi.get('https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;flag')).data
        dispatch(actChangeListContries(res))
        dispatch(actChangeLoading(false))
    }
}

export function asyncGetListCategories(hasLoading = true){
    return async dispatch =>{
        try {
            hasLoading && dispatch(actChangeLoading(true))
            var res = (await callapi.get(`/categories`)).data
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
            hasLoading && dispatch(actChangeLoading(false))
            return  res
        } catch (error) {
            console.log(error);
            hasLoading && dispatch(actChangeLoading(false))
            return  error
        }
    }
}


export function asyncGetSettings(hasLoading = true){//goi data nay đầu tiên. data thu hai dau e? // Cai nay khong nen dat loading o nhieu noi. neu e goi chung thi loading 1 lan thoi chu.

    return async dispatch =>{
        try {
            hasLoading && dispatch(actChangeLoading(true))
            var res = (await callapi.get(`/setting`)).data
            const setting = {}
            res.forEach(el=>{
                setting[el.key] = el.data
            })
            dispatch(actChangeSettings(setting))
            hasLoading && dispatch(actChangeLoading(false))
            return  res
        } catch (error) {
            hasLoading && dispatch(actChangeLoading(false))
            return  error
        }
    }
}

export function asyncWithdraw(submitdata){
    return async dispatch =>{
        try {
            const res = (await callapi.post(`/api/deposit`,submitdata)).data
            console.log(res);
            if(res.status === 1){
                dispatch(asyncGetUserData())
                return res
            }else{
                return res
            }
        } catch (error) {
            return {msg:'error', error}
        }

    }
}