export const setModal = show => ({
    type: "SET_MODAL_SHOW",
    payload: { show }
});

export const setTag = tag => ({
    type: "SET_MODAL_TAG",
    payload: { tag }
});

export const setPayload = payload => ({
    type: "SET_MODAL_PAYLOAD",
    payload: { payload }
});

export const setSize = size => ({
    type: "SET_MODAL_SIZE",
    payload: { size }
});

export const openModal = ( tag, payload, size="md" ) => dispatch => {
    dispatch(setSize(size));
    dispatch(setTag(tag));
    dispatch(setPayload(payload));
    dispatch(setModal(true));
};