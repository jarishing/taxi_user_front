import React from 'react';
import objectPath from 'object-path';
import * as api from '../../api';
import './modal.scss';

class Comment extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            order: null, 
            orderDoc: null,
            score: 1,
            comment: ""
        };
    }

    async componentDidMount(){
        try {
            const order = api.order(this.props.orderId);
            const orderDoc = await order.get();
            this.setState({ order, orderDoc });
        } catch( error ){
            console.error(error);
            window.alert("Internal Server Error");
            this.props.close();
        }
    }

    handleChange = (path) => {
        return value => {
            const state = { ... this.state };
            objectPath.set(state, path, value );
            this.setState(state);
        }
    }

    render(){

        const { orderDoc } = this.state;

        if ( orderDoc == null )
            return <div/> ;

        return (
            <div className="modal-view">
                <div className="modal-background" onClick={() => this.props.setModal()}/>
                <div className="modal-wrapper">
                    <div className="modal-comment-header">
                        <div className="modal-comment-title">
                            訂單
                        </div>
                        <div 
                            className="modal-comment-header-button"
                            onClick={() => this.props.setModal()}
                        >
                            x
                        </div>
                    </div>
                    <div className="modal-comment-body">
                        <table className="table table-striped table-custom">
                            <tbody>
                                <tr>
                                    <th>起點</th>
                                    <td>{orderDoc.start.address}</td>
                                </tr>
                                <tr>
                                    <th>終點</th>
                                    <td>{orderDoc.end.address}</td>
                                </tr>
                            </tbody>
                            {
                                orderDoc.status !== "canceled" &&
                                <tbody>
                                    <tr>
                                        <th>司機名字</th>
                                        <td>{orderDoc.acceptBy.username}</td>
                                    </tr>
                                    <tr>
                                        <th>司機電話</th>
                                        <td>{orderDoc.acceptBy.telephone_no}</td>
                                    </tr>
                                    <tr>
                                        <th>司機號碼</th>
                                        <td>{orderDoc.acceptBy.vehicle_reg_no}</td>
                                    </tr>
                                </tbody>
                            }
                        </table>
                        {
                            orderDoc.status == "confirmed" && 
                            <div>
                                <div className="form-group">
                                    <label> 評分 </label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        max="5" min="1"    
                                        value={ this.state.score} 
                                        onChange={ event => this.handleChange('score')(event.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label> 內容 </label>
                                    <textarea 
                                        className="form-control" 
                                        rows="4"
                                        value={ this.state.comment} 
                                        onChange={ event => this.handleChange('comment')(event.target.value)}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                    <div className="modal-comment-footer">
                        <div 
                            className="modal-comment-footer-button button-close" 
                            onClick={() => this.props.setModal()}
                        >
                            關閉
                        </div>
                        {
                            orderDoc.status !== "accepted" && 
                            <div 
                                className="modal-comment-footer-button button-reuse"
                                onClick={() => {
                                    this.props.reOrder( orderDoc );
                                    this.props.setModal();
                                }}
                            >
                                重出
                            </div>
                        }
                        {
                            orderDoc.status == "confirmed" && 
                            <div 
                                className="modal-comment-footer-button button-comment"
                                onClick={ async () => {
                                    await this.state.order.comment(this.state.score, this.state.comment);
                                    window.alert('成功評分!');
                                    this.props.setModal();
                                }}
                            >
                                評分
                            </div>
                        }
                        {
                            orderDoc.status == "accepted" && 
                            <div 
                                className="modal-comment-footer-button button-detail"
                                onClick={() => {
                                    this.props.detailOrder( this.props.orderId );
                                    this.props.setModal();
                                }}
                            >
                                詳情
                            </div>
                        }
                    </div>
                </div>
            </div>
        );

    }
}

export default Comment;


// <div className="modal-comment-footer-button button-close">
//     關閉
// </div>
// <div className="modal-comment-footer-button button-reuse">
//     重出
// </div>
// <div className="modal-comment-footer-button button-comment">
//     評分
// </div>
// <div className="modal-comment-footer-button button-detail">
//     詳情
// </div>