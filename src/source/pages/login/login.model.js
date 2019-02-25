import * as auth from '../../auth';
import objectPath from 'object-path';

export function handleChange(path) {
    return value => {
        const state = { ... this.state };
        objectPath.set(state, path, value );
        this.setState(state);
    }
}

export async function submit() {
    const { phone, password } = this.state.credential;

    if ( phone.trim() === '' || password.trim() === '' )
        return window.alert('用戶電話及密碼不能留空!');

    try {
        await auth.login(phone, password, true);            
        this.props.history.push('/App');
    } catch ( error ){
        console.error(error);
        return window.alert(`密碼錯誤! 請重新輸入`);
    }
}