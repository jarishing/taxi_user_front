import React from 'react';
import objectPath from 'object-path';
import * as api from '../api';
import * as callFunction from '../pages/App';

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
            const order = api.order(this.props.payload.orderId);
            const orderDoc = await order.get();
            this.setState({ order, orderDoc });
        } catch( error ){
            console.error(error);
            window.alert("Internal Server Error");
            this.props.close();
        }
    }

    async componentDidUpdate(prevProps){
        if(prevProps.show !== this.props.show && this.props.show ){
            try {
                const order = api.order(this.props.payload.orderId);
                const orderDoc = await order.get();
                this.setState({ order, orderDoc });
            } catch( error ){
                console.error(error);
                window.alert("Internal Server Error");
                this.props.close();
            }
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
            return <React.Fragment /> ;

        return (
            <div className="modal-content">
                <div className="modal-header">
                    <button 
                        type="button" 
                        className="close"
                        onClick={ this.props.close }
                    >
                        ×
                    </button>
                    <h4 className="modal-title"> 評分 </h4>
                </div>
                
            </div>
        );

    }
}

export default Comment;

// <div className="modal-body">
                    // <table className="table table-striped table-custom">
                    //     <tbody>
                    //         <tr>
                    //             <th>起點</th>
                    //             <td>{orderDoc.start.address}</td>
                    //         </tr>
                    //         <tr>
                    //             <th>終點</th>
                    //             <td>{orderDoc.end.address}</td>
                    //         </tr>
                    //     </tbody>
                        // {
                        //     orderDoc.status !== "canceled" &&
                        //     <tbody>
                        //         <tr>
                        //             <th>司機名字</th>
                        //             <td>{orderDoc.acceptBy.username}</td>
                        //         </tr>
                        //         <tr>
                        //             <th>司機電話</th>
                        //             <td>{orderDoc.acceptBy.telephone_no}</td>
                        //         </tr>
                        //         <tr>
                        //             <th>司機號碼</th>
                        //             <td>{orderDoc.acceptBy.vehicle_reg_no}</td>
                        //         </tr>
                        //     </tbody>
                        // }
//                     </table>
                    // {
                    //     orderDoc.status == "confirmed" && 
                    //     <div>
                    //         <div className="form-group">
                    //             <label> 評分 </label>
                    //             <input 
                    //                 type="number" 
                    //                 className="form-control" 
                    //                 max="5" min="1"    
                    //                 value={ this.state.score} 
                    //                 onChange={ event => this.handleChange('score')(event.target.value)}
                    //             />
                    //         </div>
                    //         <div className="form-group">
                    //             <label> 內容 </label>
                    //             <textarea 
                    //                 className="form-control" 
                    //                 rows="4"
                    //                 value={ this.state.comment} 
                    //                 onChange={ event => this.handleChange('comment')(event.target.value)}
                    //             />
                    //         </div>
                    //     </div>
                    // }
//                 </div>
//                 <div className="modal-footer">
//                     <button 
//                         type="button" 
//                         className="btn btn-default"
//                         onClick={ 
//                             // this.props.close 
//                             () => callFunction.setPage()
//                         }
//                     >
//                         關閉
//                     </button>
//                 </div>


// <div className="modal-content">
//     <div className="modal-header">
//         <button 
//             type="button" 
//             className="close"
//             onClick={ this.props.close }
//         >
//             ×
//         </button>
//         <h4 className="modal-title"> 評分 </h4>
//     </div>
//     <div className="modal-body">
        // <table className="table table-striped table-custom">
        //     <tbody>
        //         <tr>
        //             <th>起點</th>
        //             <td>{orderDoc.start.address}</td>
        //         </tr>
        //         <tr>
        //             <th>終點</th>
        //             <td>{orderDoc.end.address}</td>
        //         </tr>
        //         <tr>
        //             <th>司機名字</th>
        //             <td>{orderDoc.acceptBy.username}</td>
        //         </tr>
                
        //         <tr>
        //             <th>司機電話</th>
        //             <td>{orderDoc.acceptBy.telephone_no}</td>
        //         </tr>
        //         <tr>
        //             <th>司機號碼</th>
        //             <td>{orderDoc.acceptBy.vehicle_reg_no}</td>
        //         </tr>
        //     </tbody>
        // </table>
        // <div className="form-group">
        //     <label> 評分 </label>
        //     <input 
        //         type="number" 
        //         className="form-control" 
        //         max="5" min="1"    
        //         value={ this.state.score} 
        //         onChange={ event => this.handleChange('score')(event.target.value)}
        //     />
        // </div>
        // <div className="form-group">
        //     <label> 內容 </label>
        //     <textarea 
        //         className="form-control" 
        //         rows="4"
        //         value={ this.state.comment} 
        //         onChange={ event => this.handleChange('comment')(event.target.value)}
        //     />
        // </div>
//     </div>
//     <div className="modal-footer">
        // <button 
        //     type="button" 
        //     className="btn btn-default"
        //     onClick={ this.props.close }
        // >
        //     關閉
        // </button>
        // <button 
        //     type="button" 
        //     className="btn btn-success"
        //     onClick={async ()=>{
                // await this.state.order.comment(this.state.score, this.state.comment);
                // window.alert('成功評分!');
        //         this.props.close();
        //     }}
        // >
        //     完成
        // </button>
//     </div>
// </div>