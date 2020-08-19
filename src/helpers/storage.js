
const keyToken = "user";

const Storage = {
  setToken(token) {
    localStorage.setItem(keyToken, token)
  },
  getToken() {
    return localStorage.getItem(keyToken);
  },
  clearToken(){
    localStorage.clear(keyToken)
  }
}

export default Storage