
const keyToken = "user";
const keyJWT = "jwt";

const Storage = {
  setToken(token) {
    localStorage.setItem(keyToken, token)
  },
  getToken() {
    return localStorage.getItem(keyToken);
  },
  clearToken(){
    localStorage.clear(keyToken)
  },
  setJWT(token) {
    localStorage.setItem(keyJWT, token)
  },
  getJWT() {
    return localStorage.getItem(keyJWT);
  },
  clearJWT(){
    localStorage.clear(keyJWT)
  }

}

export default Storage