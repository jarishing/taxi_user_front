import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Modal from './modal/modal';
import Socket from './socket';

moment.prototype.display = function(){
    return this.format('MMMM Do YYYY, h:mm:ss a');
}

moment.prototype.displayShort = function(){
    return this.format('MMMM Do YYYY');
}

const mapStateToProps = state => ({
    user: state.base.user,
});

@withRouter
@connect(mapStateToProps)
export default class Entry extends React.Component {


    componentWillMount(){
        Socket.connect();
    }
    
    async componentDidMount(){
        /**
         * 
         * focus user to go back the raw page
         * 
         */
        if ( this.props.user == null )
            this.props.history.replace('/')
    }

    render(){
        return (
            <React.Fragment> 
                <Modal />
                { ... this.props.children } 
            </React.Fragment>
        )
    };
    
};

