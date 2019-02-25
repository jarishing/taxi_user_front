import axios from 'axios';
import url from './url';
import store from '../store';

export async function getPlace(place) {
    try {
        const response = await axios.get( url+ '/api/place',     
            { 
                params: { keyword: place },
                headers: { Authorization: 'Bearer ' + store.getState().base.accessToken }
            }
        );
        return response.data.data;
    } catch ( error ){
        console.warn('AccessToken stored is not valid ');
    }
};