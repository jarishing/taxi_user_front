import createReducer from 'ken.yip/react/createReducer';

const initState = {
    tag: null,
    show: false,
    payload: null,
    size: 'md'
};

const actionHandlers = {
    SET_MODAL_SHOW: ( state, action ) => {
        const result = { ... state };
        result.show = action.payload.show;
        console.log(result);
        return result;
    },
    SET_MODAL_TAG: ( state, action ) => {
        const result = { ... state };
        result.tag = action.payload.tag;
        return result;
    },
    SET_MODAL_PAYLOAD: ( state, action ) => {
        const result = { ... state };
        result.payload = action.payload.payload;
        return result;
    },
    SET_MODAL_SIZE: ( state, action ) => {
        const result = { ... state };
        result.size = action.payload.size;
        return result;
    }
};

export default createReducer(initState, actionHandlers);