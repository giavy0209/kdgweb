import callAPI from "../axios"
import { storage } from "../helpers"

export function actChangeUser(user) {
    return {
        type : 'CHANGE_USER',
        payload : {user}
    }
}

export function asyncGetUser() {
    return async dispatch => {
        const res = await callAPI.get('/user')
        storage.setItem('user' , res.data)
        dispatch(actChangeUser(res.data))
    }
}

export function actChangeBalances(balances){
    return {
        type : 'CHANGE_BALANCE',
        payload : {balances}
    }
}

export function asyncGetBalances() {
    return async dispatch => {
        const res = await callAPI.get('/balances')
        dispatch(actChangeBalances(res.balances))
    }
}

export function asyncLogin(formData) {
    return async dispatch => {
        const res = await callAPI.post('/login' , formData)
        console.log(res);
        if(res.status === 1){
            await dispatch(asyncInitAuth(res.refreshToken , res.jwt))
        }
        return res
    }
}

export function asyncInitAuth(_refresh , _jwt) {
    return async dispatch => {
        if(!_refresh || !_jwt){
            const refresh = storage.getRefresh()
            if(!refresh) return
            const resToken = await callAPI.post('/refresh',{refresh_token : refresh})
            if(resToken.status === 1){
                storage.setToken(resToken.jwt)
                storage.setRefresh(resToken.refreshToken)
            }
        }
        if(_refresh && _jwt){
            storage.setToken(_jwt)
            storage.setRefresh(_refresh)
        }
        await Promise.all([
            dispatch(asyncGetUser()),
            dispatch(asyncGetBalances())
        ])        
    }
}