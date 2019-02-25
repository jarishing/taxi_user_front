import React from 'react'
import { Switch, Route } from 'react-router-dom';
import Entry from './Entry';
import { connect } from 'react-redux';
import * as auth from './auth';
import * as pages from './pages';

// <Route exact path='/' component={}/>

class Router extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            pages: {}
        }
    }

    async componentWillMount(){
        await auth.setUserIntoReducerFromCache();
    }

    async componentDidMount(){

        /**
         * 
         * avoid loading all pages at first
         * 
         */
        // const pages = await import('./pages');
        // this.setState({ pages: pages });
    }

    render(){

        // const pages = this.state.pages;

        return(
            <Entry>
                <Switch>
                    <Route exact path='/' component={pages.login}/>
                    <Route exact path='/app' component={pages.App}/>
                    <Route exact path='/register' component={pages.register}/>
                </Switch>
            </Entry>
        );
    }
};

const mapStateToProps = ( state, ownProps ) => ({
    user: state.base.user 
});

const mapDispatchToProps = ( dispatch, ownProps ) => ({

});

/**
 * 
 * Update problem solve by 
 * https://stackoverflow.com/questions/43895805/react-router-4-does-not-update-view-on-link-but-does-on-refresh
 * 
 */
export default connect(mapStateToProps, null, null, {pure: false})(Router);