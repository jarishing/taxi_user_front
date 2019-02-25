import React from "react";
import Sidebar from "react-sidebar";
import { autobind } from 'react-decoration';
import './sidebar.scss';
import logo from '../../assets/logo.png';

export default class extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            open: false
        }
        // this.toggleSidebar = this.toggleSidebar.bind(this);
    }
    
    @autobind
    toggleSidebar(open){
        this.setState({ open });
    }

    @autobind
    renderSidebar(){
        return (
            <div className="sidebar-container">
                <div className="sidebar">
                    <ul className="sidebar-list">
                        {
                            this.props.items.map( (item, index) => (
                                <li key={index}>
                                    <a onClick={item.onClick}>
                                        <i className={item.icon}/>
                                        <span> {item.name} </span>
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="sidebar sidebar-down">
                    <ul className="sidebar-list">
                        {
                            this.props.bottom.map( (item, index) => (
                                <li key={index}>
                                    <a onClick={item.onClick}>
                                        <i className={item.icon}/>
                                        <span> {item.name} </span>
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        )
    }

    render(){
        return (
            <Sidebar
                open={this.state.open}
                onSetOpen={this.toggleSidebar}
                sidebar={<this.renderSidebar />}
            >
                { this.props.children }
            </Sidebar>
        )
    }

}