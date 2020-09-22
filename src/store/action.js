import callapi from '../axios'
import Home from '../pages/Home'
import Storage from '../helpers/storage'
import { storage } from '../helpers';
import Axios from 'axios';
import socket from '../socket'

export const CHANGE_LOADING = 'CHANGE_LOADING';
export const CHANGE_NEWS = 'CHANGE_NEWS';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
export const CHANGE_LIST_CATEGORIES = 'CHANGE_LIST_CATEGORIES';
export const CHANGE_CURRENT_URL = 'CHANGE_CURRENT_URL';
export const CHANGE_ROUTER = 'CHANGE_ROUTER';
export const CHANG_USER_DATA = 'CHANG_USER_DATA';
export const CHANG_TOKEN = 'CHANG_TOKEN';
export const CHANG_JWT = 'CHANG_JWT';

export function actChangeLoading(loading) {
    return {
        type: CHANGE_LOADING,
        payload: { loading }
    }
}
export function actChangeNews(news) {
    return {
        type: CHANGE_NEWS,
        payload: { news }
    }
}

export function atcChangeLanguage(lang) {
    return {
        type: CHANGE_LANGUAGE,
        payload: { lang }
    }
}

export function actChangeCurrentUrl(url) {
    return {
        type: CHANGE_CURRENT_URL,
        payload: { url }
    }
}

export function actChangeRouter(router) {
    return {
        type: CHANGE_ROUTER,
        payload: { router }
    }
}

export function actChangeSettings(settings) {
    return {
        type: CHANGE_SETTINGS,
        payload: { settings }
    }
}

export function actChangeListCategories(categories) {
    return {
        type: CHANGE_LIST_CATEGORIES,
        payload: { categories }
    }
}

export function actChangeUser(user) {
    return {
        type: CHANG_USER_DATA,
        payload: { user }
    }
}

export function actChangeToken(token) {
    return {
        type: CHANG_TOKEN,
        payload: { token }
    }
}

export function actChangeJWT(JWT) {
    return {
        type: CHANG_TOKEN,
        payload: { JWT }
    }
}

export function actChangeBalance(allBalance) {
    return {
        type: CHANG_USER_DATA,
        payload: { allBalance }
    }
}


export function actChangeListContries(contries) {
    return {
        type: CHANGE_SETTINGS,
        payload: { contries }
    }
}

export function asyncGetNews(skip, take,search, language){
    return async dispatch =>{
        try {
            var res = (await callapi().get(`/api/news?skip=${skip}&take=${take}&search=${search}&language=${language}`)).data
            dispatch(actChangeNews(res.data))
            return  res
        } catch (error) {
            return  error
        }
    }
}

export function asyncGetNewsById(id,next, language){
    return async dispatch =>{
        try {
            var res = (await callapi().get(`/api/get_by_id_news/${id}?next=${next}&language=${language}`)).data
            return  res
        } catch (error) {
            return  error
        }
    }
}

export function asyncGetBalance(tron_kdg_wallet, eth_usdt_wallet,tomo_address) {
    return async dispatch => {
        const res = (await callapi().get(`/api/eth_usdt/balance/${eth_usdt_wallet}`)).data
        const res2 = (await callapi().get(`/api/tron_kdg/balance/${tron_kdg_wallet}`)).data
        const res3 = (await callapi().get(`/api/knc/balance/${eth_usdt_wallet}`)).data
        const res4 = (await callapi().get(`/api/mch/balance/${eth_usdt_wallet}`)).data
        const res5 = (await callapi().get(`/api/tomo/balance/${tomo_address}`)).data
        const { eth_balance, usdt_balance } = res
        const { trx_balance, kdg_balance } = res2
        const knc_balance = res3.balance
        const mch_balance = res4.balance
        const tomo_balance = res5.balance
        dispatch(actChangeBalance({ eth_balance, usdt_balance, trx_balance, kdg_balance , knc_balance, mch_balance,tomo_balance}))

        // setInterval(async () => {
        //     const res = (await callapi().get(`/api/eth_usdt/balance/${eth_usdt_wallet}`)).data
        //     const res2 = (await callapi().get(`/api/tron_kdg/balance/${tron_kdg_wallet}`)).data
        //     const { eth_balance, usdt_balance } = res
        //     const { trx_balance, kdg_balance } = res2
        //     dispatch(actChangeBalance({ eth_balance, usdt_balance, trx_balance, kdg_balance }))
        // }, 10000);
    }
}

export function asyncLogin(submitData) {
    return async dispatch => {
        var res
        try {
            dispatch(actChangeLoading(true))
            res = ((await callapi().post('/api/authorize', submitData)))
            socket.emit('login', submitData)
            dispatch(actChangeUser(res.data.data))
            dispatch(asyncGetBalance(res.data.data.trx_address, res.data.data.erc_address))
            Storage.setToken(res.data.data._id)
            Storage.setJWT(res.data.jwtToken)
            localStorage.setItem('email', submitData.email)
            localStorage.setItem('password', submitData.password)
            localStorage.setItem('login_time', new Date())
            dispatch(actChangeToken(res.data.data._id))
            dispatch(actChangeJWT(res.data.jwtToken))
            dispatch(actChangeLoading(false))
            return { ok: true ,res}
        } catch (error) {
            dispatch(actChangeLoading(false))
            return { ok: false  ,res}
        }
    }
}

export function asyncGetUserData(token) {
    return async dispatch => {
        var token = storage.getToken()
        var jwt = storage.getJWT()
        if (token && jwt) {
            dispatch(actChangeToken(token))
            dispatch(actChangeJWT(jwt))
            try {
                const res = (await callapi().get(`/api/user/${token}`)).data
                if (res.status === 1) {
                    dispatch(actChangeUser(res.data))
                    dispatch(asyncGetBalance(res.data.trx_address, res.data.erc_address,res.data.tomo_address))
                    return true
                } else {
                    Storage.clearToken()
                }
            } catch (error) {
                return { msg: 'some error', error }
            }
        } else {
            dispatch(actChangeUser(null))
            return false
        }
    }
}

export function asyncGetListContries() {
    return async dispatch => {
        dispatch(actChangeLoading(true))
        const res = (await Axios.get('https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;flag')).data
        dispatch(actChangeListContries(res))
        dispatch(actChangeLoading(false))
    }
}

export function asyncGetListCategories(hasLoading = true) {
    return async dispatch => {
        try {
            hasLoading && dispatch(actChangeLoading(true))
            var res = (await callapi().get(`/categories`)).data
            dispatch(actChangeListCategories(res))
            const router = []
            res.forEach(el => {
                var route = {
                    path: el.slug,
                    pathEN: el.slugEN,
                    exact: true,
                    isShow: el.display,
                    render: Home,
                    page: el.page,
                    name: { name_vi: el.name_vi, name_en: el.name_en },
                    id: el._id,
                    parent: el.parent,
                    isURL: el.isURL,
                    reqLogin: el.reqLogin,
                    type: el.type,
                }
                router.push(route)
            })
            dispatch(actChangeRouter(router))
            hasLoading && dispatch(actChangeLoading(false))
            return res
        } catch (error) {
            hasLoading && dispatch(actChangeLoading(false))
            return error
        }
    }
}


export function asyncGetSettings(hasLoading = true) {

    return async dispatch => {
        try {
            hasLoading && dispatch(actChangeLoading(true))
            var res = (await callapi().get(`/setting`)).data
            const setting = {}
            res.forEach(el => {
                setting[el.key] = el.data
            })
            dispatch(actChangeSettings(setting))
            hasLoading && dispatch(actChangeLoading(false))
            return res
        } catch (error) {
            hasLoading && dispatch(actChangeLoading(false))
            return error
        }
    }
}

export function asyncWithdraw(submitdata) {
    return async dispatch => {
        try {
            const res = (await callapi().post(`/api/deposit`, submitdata)).data
            if (res.status === 1) {
                dispatch(asyncGetUserData())
                return res
            } else {
                return res
            }
        } catch (error) {
            return { msg: 'error', error }
        }

    }
}

export function asyncGetHistoryUSDT(userWallet, skip, coin) {
    return async dispatch => {
        dispatch(actChangeLoading(true))
        const res = (await callapi().get(`/api/blockchain_transaction?coin_type=${coin.toLowerCase()}&address=${userWallet}&skip=${skip}&take=10`)).data
        console.log(res);
        if (res.status === 1) {
            var result = res.data.result
            result = result.map(o => {
                var data = {
                    time: new Date(o.timeStamp * 1000),
                    type: o.form === userWallet ? 0 : 1,
                    value: coin === 'MCH' ? o.value / 1e8 : coin === 'KNC' ?  o.value / 1e18 : o.value / 1e6 ,
                    hash: o.hash
                }
                return data
            })
            dispatch(actChangeLoading(false))
            return result
        } else {
            dispatch(actChangeLoading(false))
            return []
        }
    }
}

export function asyncGetHistoryTRX(userWallet, skip, coin) {
    return async dispatch => {
        dispatch(actChangeLoading(true))
        const res = (await callapi().get(`/api/blockchain_transaction?coin_type=${coin.toLowerCase()}&address=${userWallet}&skip=${skip}&take=99999&begin_date=1970-01-01`)).data
        console.log(res);
        if (res.status === 1) {
            var result = res.data.data
                result = result.map(o => {
                    var data = {
                        time: new Date(o.timestamp),
                        type: o.transferFromAddress === userWallet ? 0 : 1,
                        value: coin.toLowerCase() === 'kdg' ? o.amount / 1e18 :  o.amount / 1e6, 
                        hash: o.transactionHash
                    }
                    return data
                })
            dispatch(actChangeLoading(false))
            return result
        }else{
            dispatch(actChangeLoading(false))
            return []
        }
    }
}

export function asyncGetHistoryTOMO(userWallet, skip, coin) {
    return async dispatch => {
        userWallet = userWallet.toLowerCase()
        dispatch(actChangeLoading(true))
        const res = (await callapi().get(`/api/blockchain_transaction?coin_type=${coin.toLowerCase()}&address=${userWallet}&skip=${skip}&take=100&begin_date=1970-01-01`)).data
        if (res.status === 1) {
            var result = res.data.items
                result = result.map(o => {
                    var data = {
                        time: new Date(o.timestamp),
                        type: o.from === userWallet ? 0 : 1,
                        value:  o.value / 1e18,
                        hash: o.hash
                    }
                    return data
                })
            dispatch(actChangeLoading(false))
            return result
        }else{
            dispatch(actChangeLoading(false))
            return []
        }
    }
}