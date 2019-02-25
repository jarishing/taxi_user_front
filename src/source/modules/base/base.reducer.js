import createReducer from 'ken.yip/react/createReducer';

const initState = {
    user : null,
    accessToken : null,
    location: null
};

const actionHandlers = {
    SET_USER: ( state, action ) => {
        let result = { ... state };
        result.user = action.payload.user;
        result.accessToken = action.payload.accessToken;
        return result;
    },
    SET_LOCATION: ( state, action ) => {
        let result = { ... state };
        result.location = action.payload.location;
        return result;
    },
};

export default createReducer(initState, actionHandlers);