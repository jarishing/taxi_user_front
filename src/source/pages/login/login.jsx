import React from 'react';
import View from './login.view';
import { action } from '../../modules';
import { connect } from 'react-redux';
import * as functions from './login.model';

const mapStateToProps = ( state, ownProps ) => ({
    user: state.base.user 
});

const mapDispatchToProps = ( dispatch, ownProps ) => ({
    setUser: (user, accessToken) => dispatch(action.base.setUser(user, accessToken))
});

@connect(mapStateToProps, mapDispatchToProps)
class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            credential: {
                phone: "", password: "",
            },
            remainder: false 
        };
        
        this.functions = {};

        Object.keys(functions).forEach(key => {
            this.functions[key] = functions[key].bind(this);
        })

    };

    async componentWillMount(){
        if ( this.props.user )
            this.props.history.push('/App');
    };

    async componentDidUpdate(){
        if ( this.props.user )
            this.props.history.push('/App');
    }

    render(){
        return (
            <View 
                { ... this.functions }
                { ... this.props }
                { ... this.state }
            />
        );
    };
};

export default Login;
