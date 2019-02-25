import React from 'react';
// import logo from '../../assets/logo.png';
import './register.scss';
import objectPath from 'object-path';
import url from '../../api/url';
import axios from 'axios';

export default class extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            username: '',
            email: '',
            phone: '',
            password: '',
            confirm: ''
        }
    }

    handleChange = (path) => {
        return value => {
            const state = { ... this.state };
            objectPath.set(state, path, value );
            this.setState(state);
        }
    }

    register = async () => {
        const { username, email, phone, password, confirm } = this.state;

        for( const key of ['username', 'email', 'phone', 'password', 'confirm'])
            if ( this.state[key] == "")
                return window.alert("請填寫所有資料");

        if ( password != confirm )
            return window.alert('請9檢查你的密碼及確認密碼');

        try {
            await axios.post(`${url}/api/user`, {
                type: 'user',
                username, email, 
                telephone_no: phone, 
                password
            });
            window.alert(`註冊成功! 你現在可以使用 ${email} 登入!`);
            this.props.history.replace('/')
        } catch ( error ){
            window.alert('註冊失敗, 請檢查你的輸入');
        }
        
    }

    render(){

        return (
            <div className="login-container" style={{ padding:'16px'}}>
                <div className="Card">
                    <div className="brand">
                        <img src="https://s3-ap-southeast-1.amazonaws.com/image-bucket-ken.yip/logo.png" style={{ height:'100px'}}/>
                        <h2> 註冊成為打的用戶 </h2>
                    </div>
                    <div className="InputForm">
                        <label>用戶名字</label>
                        <input 
                            className="my_input_style"
                            value={ this.state.username }
                            onChange={ event => this.handleChange('username')(event.target.value)}    
                        />
                    </div>
                    <div className="InputForm">
                        <label>電郵</label>
                        <input 
                            className="my_input_style" 
                            type="email"
                            value={ this.state.email }
                            onChange={ event => this.handleChange('email')(event.target.value)}    
                        />
                    </div>
                    <div className="InputForm">
                        <label>電話號碼</label>
                        <input 
                            className="my_input_style" 
                            type="phone"
                            value={ this.state.phone }
                            onChange={ event => this.handleChange('phone')(event.target.value)}   
                        />
                    </div>
                    <div className="InputForm">
                        <label>密碼</label>
                        <input 
                            className="my_input_style" 
                            type="password"
                            value={ this.state.password }
                            onChange={ event => this.handleChange('password')(event.target.value)}   
                        />
                    </div>
                    <div className="InputForm">
                        <label>確認密碼</label>
                        <input 
                            className="my_input_style" 
                            type="password"
                            value={ this.state.confirm }
                            onChange={ event => this.handleChange('confirm')(event.target.value)}   
                        />
                    </div>
                    <button 
                        className="btn btn-warning btn-sm width100"
                        onClick={ this.register }
                    >
                        註冊
                    </button>
                </div>
                <footer
                    style={{ textAlign:'center', margin:'12px'}}
                    onClick={()=> this.props.history.replace('/')}
                > 
                    返回主頁 
                </footer>
            </div>
        )
    }

}