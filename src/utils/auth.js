import Cookies from 'js-cookie'
import { param2Obj } from "./index";
const TokenKey = 'TokenKey';
const IdTokenKey = 'id_token'
const expires = {
	expires: new Date(new Date().getTime() + 1000 * 60 *60 * 24 *30)
}

export function getIdToken() {
	let query = param2Obj(window.location.search);

	if (query[IdTokenKey]) {
	  return query[IdTokenKey];
	} 
	return null;
  }

export function getToken() {
	return window.sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
	return window.sessionStorage.setItem(TokenKey, token)
}

export function removeToken(name) {
	return window.sessionStorage.removeItem(TokenKey);
}


export function setCookie(name, value) {
	return Cookies.set(name, value, expires)
}

export function getCookie(name) {
	return Cookies.get(name)
}

export function removeCookie(name) {
	return Cookies.remove(name)
}

export const uploadHaders = () => {
	return {
		'Authorization': getToken()
	}
};