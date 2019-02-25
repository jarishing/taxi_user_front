import React from 'react';
import './modal.css';
import { connect } from 'react-redux' ;
import { action } from '../modules';
import classnames from '../utils/classnames';
import * as modals from './';

class Modal extends React.Component{

    constructor(props){
        super(props);
        // this.state = { modals: {} };
    }

    async componentDidMount(){
        // const modals = await import('./');
        // this.setState({ modals: modals });
    }

    render(){

        const { show, tag, payload, size } = this.props;

        let Modal = null;

        if (( Modal = modals[this.props.tag]) == null )
            return <React.Fragment />;

        const className = this.props.show? "modal fade in block": "modal fade none";

        return (
            <div className={className}>
                <div className={classnames("modal-dialog", `modal-${size}`)}>
                    <Modal { ... this.props } />
                </div>
            </div>
        )
    }
}

const mapStateToProps = ( state, ownProps ) => ({
    show: state.modal.show,
    tag: state.modal.tag,
    payload: state.modal.payload,
    size: state.modal.size
});

const mapDispatchToProps = ( dispatch, ownProps ) => ({
    close: () => dispatch(action.modal.setModal(false))
});

export default (connect(mapStateToProps, mapDispatchToProps)(Modal));