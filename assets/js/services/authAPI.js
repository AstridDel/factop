import axios from "axios";
import jwtDecode from "jwt-decode";


/**
 *  Deconnexion et suppression du token du locastorage et sur axios
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}


/**
 * Requete http d'authentification, stockage du token ds le storage et sur axios
 * @param {object} credentials 
 */
function authenticate(credentials) {
    return axios
        .post("http://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            //stockage du token dans le localstorage
            window.localStorage.setItem("authToken", token);
            // prevenir axios d un header par defaut dans toutes les futures request HTTP
            setAxiosToken(token);
        });
}


/**
 * Positionne le token jwt sur axios
 * @param {string} token le token jwt 
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}


/**
 * Mise en place lors du chargement de l appli
 */
function setup() {
    // a-t-on un token ?
    const token = window.localStorage.getItem("authToken");
    // si token encore valide
    if (token) {
        const { exp: expiration } = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}


/**
 *  Permet de savoir si on est authentifié ou pas
 */
function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");

    if (token) {
        const { exp: expiration } = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}


export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};