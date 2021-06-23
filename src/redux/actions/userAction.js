import { API_URL } from '../../helper';
import axios from 'axios';

export function fetchUsers() {
    return {
        type: 'FETCH_USER',
        payload: axios.get(`${API_URL}/users/all`)
    };
}

export function setUser(user) {
    return {
        type: 'SET_USER',
        payload: user
    };
}