import { signout } from "./api-auth"

const authenticate = (jwt, cb) => {
    if (typeof window !== "undefined")
        sessionStorage.setItem('jwt', JSON.stringify(jwt))
    cb()
}

const isAuthenticated = () => {
    if (typeof window == "undefined")
        return false
    if (sessionStorage.getItem('jwt'))
        return JSON.parse(sessionStorage.getItem('jwt'))
    else
        return false
}

const clearJWT = (cb) => {
    if (typeof window !== "undefined")
        sessionStorage.removeItem('jwt')
    cb()
    signout().then((data) => {
        document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00UTC; path=/;"
    })
}

const updateUser = (user, cb) => {
    if (typeof window !== "undefined") {
        if (sessionStorage.getItem('jwt')) {
            let auth = JSON.parse(sessionStorage.getItem('jwt'))
            auth.user = user
            sessionStorage.setItem('jwt', JSON.stringify(auth))
            cb()
        }
    }
}

export default { authenticate, isAuthenticated, clearJWT, updateUser }