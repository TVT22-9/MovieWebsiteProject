
//imports signals from react that make state management eesier
import { effect, signal } from "@preact/signals-react";
import axios from "axios";

export const jwtToken = signal(getSessionToken());
export const userData = signal(null);
//tries to get token from session storage, otherwise set it as null
export function getSessionToken() {
    const t = sessionStorage.getItem('token');
    return t === null || t === 'null' ? '' : t;
}

effect(() => {
    //saves the token into the session storage
    sessionStorage.setItem('token', jwtToken.value);
    //if token is >0 it tries to get userdata from backend 
    if (jwtToken.value.length > 0) {
        const config = { headers: { Authorization: 'Bearer ' + jwtToken.value } };
        axios.get('/user/private', config)
            .then(resp => userData.value = resp.data)
            .catch(err => console.log(err.response.data))
    }
});