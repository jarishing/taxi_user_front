export const setUser = ( user, accessToken ) => ({
    type: 'SET_USER',
    payload: { user, accessToken }
});

export const setLocation = ( lat, lng ) => ({
    type: 'SET_LOCATION',
    payload: { location : { lat, lng } }
})