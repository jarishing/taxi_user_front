import { combineReducers } from 'redux';

import base from './base/base.reducer';
import modal from './modal/modal.reducer';

import * as baseAction from './base/base.action';
import * as modalAction from './modal/modal.action';

const reducers = combineReducers({ 
    base: base, 
    modal: modal
});

export const action = {
    base: baseAction,
    modal: modalAction
};

export default reducers;