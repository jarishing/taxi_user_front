import React from 'react';
import './login.scss';
// import logo from '../../assets/logo.png';

export default props => {

    return (
        <div 
            className="login-container"
        >
            <div className="login-content">
                <div className="brand">
                    <img src="https://s3-ap-southeast-1.amazonaws.com/image-bucket-ken.yip/logo.png" style={{ height:'100px'}}/>
                    <h2> 打的 DA DI </h2>
                </div>
                <p> 登入至你的賬戶 </p>
                <form className="login-content__form">
                    <div className="form-group">
                        <input  
                            className="form-control" 
                            placeholder="用戶手機"
                            value={props.credential.phone}
                            onChange={event => props.handleChange('credential.phone')(event.target.value)}
                        /> 
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="用戶密碼" 
                            value={props.credential.password}
                            onChange={event => props.handleChange('credential.password')(event.target.value)}   
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-success width100"
                        onClick={ event => {
                            event.preventDefault();
                            props.submit();
                        }}
                    > 
                        登入
                    </button>
                </form>
                <footer 
                    style={{ color: 'orange' }}
                    onClick={ () => props.history.push('/register')}
                >
                    沒有賬號? 立刻註冊!
                </footer>
            </div>
        </div>
    )
}