import React from 'react';
import ReactSidebar from '../components/ReactSidebar/Sidebar';
import './App.scss';
import Map from '../components/map';
import axios from 'axios';
import url from '../api/url';
import PlaceRecord from './placeRecord';
const placeRecord = PlaceRecord.getInstance();
import * as placeApi from '../api/place';
import objectPath from 'object-path';
import { connect } from 'react-redux';
import * as api from '../api';
import Socket from '../socket';
import moment from 'moment';
import * as auth from '../auth';
import { action } from '../modules';
import Modal from '../components/modal/modal';

const mapStateToProp = state => ({
    location: state.base.location,
    show: state.modal.show
});

const mapDispatchToProp = dispatch => ({
    open: (orderId, order) => dispatch(action.modal.openModal('COMMENT_ORDER', { orderId, order  }, 'md'))
});

let timeout = null;

@connect(mapStateToProp, mapDispatchToProp)
export default class extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            page: null || "打的 DADI",
            nearBy: [],
            place: null,
            reqBody: {
                origin: null,
                destination: null,
                route: null,
                criteria: {
                    taxiType: 'red', 
                    discount: 100,
                    tunnel: 'any',
                    passenger: 4,
                    payment: 'cash'
                }
            },
            search: null,
            query: "",
            order: null,
            orderDoc: null,
            cost: null,
            history: [],


            modal: false,
            modalData: null
        };
    }
    
    getNearBy = () => {
        if ( navigator.geolocation )
            navigator.geolocation.getCurrentPosition(async position => {
                const { latitude, longitude } = position.coords;
                const places = await axios.get(`${url}/api/place/address`, { params: { lat: latitude, lng: longitude }});
                const top3 = places.data.data.slice(0, 3);
                this.setState({ nearBy: top3 });
            });
    }

    getRecord = async () => {
        // const history = await api.order.getCommentOrder();
        const history = await api.order.getAllOrder();
        this.setState({ history: history });
    }

    createOrder = async () => {
        const reqBody = { ... this.state.reqBody };

        reqBody.origin = reqBody.origin.location;
        reqBody.route = reqBody.route? reqBody.route.location: void 0;
        reqBody.destination = reqBody.destination.location;

        try {
            const order = await api.order.create(reqBody);
            this.setState({ order: order });
        } catch( error ){
            console.error(error);
            window.alert("發生錯誤, 請重新下單");
            return this.setState({ page: "打的 DADI" });
        }
    }

    makeOrder = () => {

        timeout = setTimeout(()=>{
            if ( this.state.reqBody.criteria.discount != 100 )
                if (window.confirm("你已經等侯了一分鍾, 在繁忙時間使用正價可以更容易找到司機, 請問要轉換為正價嗎? ")){
                    this.handleChange('reqBody.criteria.discount')(100);
                    this.state.order.cancel();
                    return this.createOrder();
                }
            clearTimeout(timeout);
            timeout = setTimeout(()=>{
                this.state.order.cancel();
                clearTimeout(timeout);
                window.alert("你已經等侯了兩分鍾, 如須要的士服務, 請重新輪侯");
                this.setState({ order: null,  page: "打的 DADI" });
            }, 60 * 1000 );
        }, 60 * 1000 );

        const { origin, route, destination } = this.state.reqBody;

        if ( origin == null || destination == null )
            return window.alert('請設置起點及終點');

        this.setState({ page: '正在下單', cost: null }, this.createOrder );
    };
    
    async componentDidMount(){
        this.getNearBy();
        this.getRecord();
        Socket.listen( async event => {
            console.log("App: " + event );
            if ( event == "DRIVER_ACCEPT" ){
                clearTimeout(timeout);
                const orderDoc = await this.state.order.get();
                const user = await api.user.getUser(orderDoc.acceptBy._id);
                orderDoc.acceptBy.location = user.position;
                this.setState({ orderDoc: orderDoc, page: "接受訂單" });
            } else if ( event == "DRIVER_RELEASE" && this.state.page == "接受訂單") {
                window.alert("司機已取消你的訂單, 如有任何問題, 可向客服查詢");
                try {
                    await this.state.order.cancel();
                } catch( error ){ console.error(error); }

                this.setState({ order: null, orderDoc: null, page: "打的 DADI" });
            }
        });
    }

    async componentDidUpdate( prevProp ){
        if ( !this.props.show && prevProp.show )
            this.getRecord();
    }

    async componentWillUnmount(){
        Socket.mute();
    }

    sidebarItems = [
        {
            name: "主頁",
            icon: "icon-home5",
            onClick: () => {
                this.setState({ page: '打的 DADI'});
                this.refs.sidebar.toggleSidebar(false);
            }
        },
        {
            name: '訂單紀錄',
            icon: 'icon-stack-empty',
            onClick: () => {
                this.getRecord();
                this.setState({ page: "訂單紀錄" });
                this.refs.sidebar.toggleSidebar(false);
            }
        },
        {
            name: '分享',
            icon: 'icon-share2'
        },
        {
            name: 'Facebook 專頁',
            icon: 'icon-facebook2'
        },
        {
            name: '關於我們',
            icon: 'icon-question3'
        }
    ]

    sidebarBottom = [
        {
            name: '登出',
            icon: 'icon-esc',
            onClick: () => {
                clearTimeout(timeout);
                auth.clearInfo();
                this.props.history.replace('/');   
            }
        }
    ]

    handleChange = (path) => {
        return value => {
            const state = { ... this.state };
            objectPath.set(state, path, value );
            this.setState(state);
        }
    }

    render(){
        return (
            <ReactSidebar
                ref="sidebar"
                items={ this.sidebarItems }
                bottom={ this.sidebarBottom }
            >
                <div className="App">
                    <div className="App__bar">
                        { this.state.page }
                        <i 
                            className="Sidebar__Menu wb-align-left"
                            onClick={()=> this.refs.sidebar.toggleSidebar(true)}
                        />
                    </div>
                    { 
                        this.state.page == "打的 DADI" && <this.renderAppMain /> 
                    }
                    { 
                        this.state.page == "更多選項" && <this.renderOption/> 
                    }
                    {
                        this.state.page == "正在下單" && <this.renderLoading />
                    }
                    {
                        this.state.page == "接受訂單" && <this.renderOrderAccepted />
                    }
                    {
                        this.state.page == "選擇地點" && <this.renderSelectLocation />
                    }
                    {
                        this.state.page == "訂單紀錄" && <this.renderOrderRecord />
                    }
                </div>
            </ReactSidebar>
        )
    }
    

    renderAppMain = props => {
        return (
            <React.Fragment>
                <div className="App__body">
                    <div className="App__Form">
                        <p className="alert" onClick={() => console.log(this.state)}>
                            <i className="wb-bell"/> 現時交通情方比較繁忙! 減少折扣可較客易找到的士!
                        </p>
                        <div 
                            className="input"
                            onClick={() => this.setState({ page: '選擇地點', place: 'origin',  cost: null})}
                        >
                            <i className="icon-location4"/> 
                            { 
                                this.state.reqBody.origin? <span 
                                    style={{ color:'black'}}
                                >
                                    {this.state.reqBody.origin.address}
                                </span> : <span> 起點 </span> 
                            }
                        </div>
                        <div 
                            className="input"
                            onClick={() => this.setState({ page: '選擇地點', place: 'route', cost: null })}
                        >
                            <i className="icon-pushpin"/>
                            { 
                                this.state.reqBody.route? <span 
                                    style={{ color:'black'}}
                                >
                                    {this.state.reqBody.route.address}
                                </span> : <span> 中途站 </span> 
                            }
                        </div>
                        <div 
                            className="input"
                            onClick={() => this.setState({ page: '選擇地點', place: 'destination',  cost: null})}
                        >
                            <i className="icon-flag3"/> 
                            { 
                                this.state.reqBody.destination? <span 
                                    style={{ color:'black'}}
                                >
                                    {this.state.reqBody.destination.address}
                                </span> : <span> 終點 </span> 
                            }
                        </div>
                        <div className="info" style={{ height:'16px'}}>
                            { this.state.cost && <span> 預計車資: ${this.state.cost} </span> }
                            <span 
                                className="option"
                                onClick={()=> this.setState({ page: '更多選項'})}
                            > 
                                更多選項 
                            </span>
                        </div>
                        <div 
                            className="App__button" 
                            style={{ margin:'12px'}}
                            onClick={ this.makeOrder }
                        >
                            <i className="icon-car2"/> 立即打的
                        </div>
                    </div>
                </div>
                <div className="Main__Map__Container">
                    <Map 
                        location={ this.props.location }
                        maker={this.props.location? [this.props.location]: []}
                    />
                </div>
            </React.Fragment>
        )
    }

    renderOption = props => {

        return (
            <div className="App__body" >
                <div className="App__Form" style={{ padding:'10px'}}>
                    <div className="input-group">
                        <label> 隧道 </label>
                        <div className="btn-group">
                            {
                                [
                                    { name: '任行', value: 'any' },
                                    { name: '東隧', value: 'eastTunnel' },
                                    { name: '西隧', value: 'westTunnel' },
                                    { name: '紅隧', value: 'hungHomTunnel' }
                                ].map( (item, index) => (
                                    <button 
                                        type="button" 
                                        key={index}
                                        className="btn btn-default btn-sm"
                                        onClick={()=>this.handleChange('reqBody.criteria.tunnel')(item.value)}
                                        style={{ backgroundColor: this.state.reqBody.criteria.tunnel == item.value? '#efefef': 'unset'}}
                                    >
                                        { item.name }
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                    <div className="input-group">
                        <label> 的士類型 </label>
                        <div className="btn-group">
                            {
                                [
                                    { name: '紅的', value: 'red' },
                                    { name: '綠的', value: 'green' },
                                    { name: '籃的', value: 'blue' },
                                ].map( (item, index) => (
                                    <button 
                                        type="button" 
                                        key={index}
                                        className="btn btn-default btn-sm"
                                        onClick={()=>this.handleChange('reqBody.criteria.taxiType')(item.value)}
                                        style={{ backgroundColor: this.state.reqBody.criteria.taxiType == item.value? '#efefef': 'unset'}}
                                    >
                                        { item.name }
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                    <div className="input-group">
                        <label> 乘客人數 </label>
                        <div className="btn-group">
                            {
                                [
                                    { name: '四人', value: 4 },
                                    { name: '五人', value: 5 },
                                    { name: '珍寶', value: 6 },
                                    { name: '傷殘', value: 7 },
                                ].map( (item, index) => (
                                    <button 
                                        type="button" 
                                        key={index}
                                        className="btn btn-default btn-sm"
                                        onClick={()=>this.handleChange('reqBody.criteria.passenger')(item.value)}
                                        style={{ backgroundColor: this.state.reqBody.criteria.passenger == item.value? '#efefef': 'unset'}}
                                    >
                                        { item.name }
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                    <div className="input-group">
                        <label> 支付方式 </label>
                        <div className="btn-group">
                            {
                                [
                                    { name: '現金', value: 'cash' },
                                    { name: '信用卡', value: 'creditCard' },
                                    { name: '支付寶', value: 'alipay' },
                                ].map( (item, index) => (
                                    <button 
                                        type="button" 
                                        key={index}
                                        className="btn btn-default btn-sm"
                                        onClick={()=>this.handleChange('reqBody.criteria.payment')(item.value)}
                                        style={{ backgroundColor: this.state.reqBody.criteria.payment == item.value? '#efefef': 'unset'}}
                                    >
                                        { item.name }
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                    <div className="input-group">
                        <label> 折扣 </label>
                        <div className="btn-group">
                            {
                                [
                                    { name: '全數', value: 100 },
                                    { name: '九折', value: 90 },
                                    { name: '八五折', value: 85 },
                                ].map( (item, index) => (
                                    <button 
                                        type="button" 
                                        key={index}
                                        className="btn btn-default btn-sm"
                                        onClick={()=>this.handleChange('reqBody.criteria.discount')(item.value)}
                                        style={{ backgroundColor: this.state.reqBody.criteria.discount == item.value? '#efefef': 'unset'}}
                                    >
                                        { item.name }
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                    <div 
                        className="App__button" 
                        style={{ margin:'12px', backgroundColor: 'green'}}
                        onClick={()=> this.setState({ page: '打的 DADI'})}
                    >
                        確定
                    </div>
                </div>
            </div>
        )
    }

    renderLoading = props => {
        
        return(
            <div className="waiting-screen">   
                <h3> 正在尋找的士 </h3>
                <p className="description"> 你可以現在或在下單後五分鍾內取消訂單 </p>
                <div>
                    <span
                        className="cancel"
                        onClick={ async ()=> {
                            this.setState({ page: '打的 DADI'});
                            await this.state.order.cancel();
                            clearTimeout(timeout);
                        }}
                        style={{ color: 'red'}}
                    >
                        取消訂單     
                    </span> 
                </div>
            </div>
        )
    }

    renderSelectLocation = props => {

        const renderOption = (pos, index)=> {
            return (
                <div 
                    key={index} 
                    className="address-selection"
                    onClick={() => {
                        placeRecord.push(pos);
                        this.handleChange(`reqBody.${this.state.place}`)(pos);
                        this.setState({ 
                            page: '打的 DADI',
                            search: null,
                            place: null,
                            query: ""
                        }, async () => {

                            if ( this.state.reqBody.origin && this.state.reqBody.destination ){
                                try {
                                    const { taxiType, discount = 100, tunnel = "any" } = this.state.reqBody.criteria;

                                    const {origin, destination, route} = this.state.reqBody;

                                    const response = await axios.post(
                                        `${url}/api/place/path`, 
                                        { 
                                            origin: origin.location, 
                                            route: route? route.location: void 0,
                                            destination: destination.location, 
                                            taxiType, discount, tunnel 
                                        }
                                    );

                                    const cost = response.data.data.cost;

                                    this.setState({ cost: cost });
                                } catch( error ){
                                    console.error(error);
                                }
                            }

                        });
                    }}
                >
                    <div className="icon">
                        <i className="icon-location3"/>
                    </div>
                    <div className="address">
                        { pos.address }
                    </div>
                </div>
            )
        }

        return (
            <div className="App__body">
                <div className="App__form" style={{ padding:'8px'}}>
                    <div className="input-group">
                        <label> 搜索地點 </label>
                        <div className="flex">
                            <input 
                                className="my_input_style"
                                placeholder="請在此輸入你身邊的地點"
                                style={{ fontSize:'12px'}}
                                value={ this.state.query }
                                onChange={ event => this.handleChange('query')(event.target.value )}
                            />
                            <div style={{ width:'30px', textAlign:'center', marginLeft:'6px'}}>
                                <i 
                                    className=" icon-search4" 
                                    style={{ lineHeight:'25px'}}
                                    onClick={ async () => {
                                        if ( this.state.query == "")
                                            return window.alert('請輸入地點');
                                        const result = await placeApi.getPlace(this.state.query);
                                        if ( result.length < 1 )
                                            return window.alert(`無法找到 ${this.state.query}, 請使用一些常見的地標`);
                                        this.setState({ search: result.slice(0, 3)});
                                    }}   
                                />
                            </div>
                        </div>
                    </div>
                    {
                        this.state.search && (
                            <div className="input-group">
                                <label> 搜索結果 </label>
                                { 
                                    this.state.search.map(renderOption) 
                                }
                            </div>
                        )
                    }
                    {
                        this.state.search == null && (
                            <React.Fragment>
                                <div className="input-group">
                                    <label> 附近地點 </label>
                                    { 
                                        this.state.nearBy.length < 1 && <div style={{ color:'grey'}}>
                                            無法找到你附近地點的地點, 請檢查你的 GPS 信號
                                        </div>
                                    }
                                    { 
                                        this.state.nearBy.map(renderOption) 
                                    }
                                </div>
                                <div className="input-group">
                                    <label> 最近紀錄 </label>
                                    {
                                        placeRecord.place.length < 1 && <div style={{ color:'grey'}}>
                                            沒有何任紀錄
                                        </div>
                                    }
                                    {
                                        placeRecord.place.map(renderOption)
                                    }
                                </div>
                            </React.Fragment>
                        )
                    }
                </div>  
                <footer 
                    style={{ textAlign:'center', padding:'16px', color:'orange'}}
                    onClick={()=> {
                        this.handleChange(`reqBody.${this.state.place}`)(null);
                        this.setState({ 
                            page: '打的 DADI',
                            search: null,
                            place: null,
                            query: ""
                        });
                    }}
                >
                    取消
                </footer>
            </div>
        )
    }

    renderOrderAccepted = props => {
        const { acceptBy } = this.state.orderDoc;

        return (
            <div>
                <div className="App__body">
                    <div className="App__form" style={{ marginBottom:'12px'}}>
                        <div className="driver_info">
                            <div>
                                <i className="fa fa-user"/> 
                            </div>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th>名稱</th>
                                        <td>{acceptBy.username}</td>
                                    </tr>
                                    <tr>
                                        <th>車牌號碼</th>
                                        <td>{acceptBy.vehicle_reg_no}</td>
                                    </tr>
                                    <tr>
                                        <th>電話</th>
                                        <td>
                                            <a href={`tel:${acceptBy.telephone_no}`}>
                                                {acceptBy.telephone_no} 
                                                <i className="icon-phone2" style={{ marginLeft:'6px'}}/> 
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>    
                    <div className="App__form Cancel__order">
                        <p 
                            className="button"
                            onClick={ async () => {
                                if ((moment(this.state.orderDoc.updatedAt).add(5, 'minute')).isAfter(moment())){
                                    window.alert('你已取消這個 Order ');
                                    this.setState({ page: '打的 DADI'});
                                    await this.state.order.cancel();
                                } else {
                                    window.alert("你只能取消五分鍾前的落單!");
                                }
                            }}
                        > 
                            取消訂單 
                        </p>
                        <p className="description"> 在下單後 5 分鍾內, 你可以按取消訂單按鍵取消訂單 </p>
                    </div>
                </div>
                <div className="Main__Map__Container">
                    <Map 
                        location={ this.props.location }
                        maker={acceptBy.location ? [] :this.props.location? [this.props.location]: []}
                        origin={acceptBy.location}
                        destination={ this.props.location }
                    />
                </div>
            </div>
        )
        // "渝時操作",
        // "你只能取消五分鍾前的落單",
    }

    setModal = ( orderId ) => {
        // console.log("hello");
        this.setState({ modal: !this.state.modal, modalData: orderId });
    }

    backToOrderPage = async ( orderId ) => {
        const order = await api.order(orderId);
        const orderDoc = await order.get();
        const user = await api.user.getUser(orderDoc.acceptBy._id);
        orderDoc.acceptBy.location = user.position;
        this.setState({ order: order, orderDoc: orderDoc, page: "接受訂單" });
    }

    setReOrder = ( order ) => {
        this.setState({ 
            page: '打的 DADI',
            reqBody: {
                origin: {
                    address: order.start.address,
                    location:{
                        lat: order.start.lat,
                        lng: order.start.lng
                    }
                },
                destination: {
                    address: order.end.address,
                    location:{
                        lat: order.end.lat,
                        lng: order.end.lng
                    }
                },
                route: order.route? 
                    {
                        address: order.route.address,
                        location:{
                            lat: order.route.lat,
                            lng: order.route.lng
                        }
                    }:null
                ,
                criteria: {
                    taxiType: order.criteria.taxiType, 
                    discount: order.criteria.discount,
                    tunnel: order.criteria.tunnel,
                    passenger: order.criteria.passenger,
                    payment: order.criteria.payment
                }
            }
        });
    }
    
    renderOrderRecord = props => {
        return (
            <div className="record-container">
                {
                    this.state.modal && 
                    <Modal 
                        setModal = { this.setModal }
                        reOrder = { this.setReOrder }
                        detailOrder = { this.backToOrderPage }
                        orderId = { this.state.modalData }
                    />
                }
                {
                    this.state.history.map( history => (
                        <div 
                            key={history._id}
                            onClick={() =>
                                this.setModal(history._id)
                                // () => this.props.open(history._id, history)
                            }
                        >
                            <div className="order-card">
                                <p className="location"> 
                                    <i className="icon-location4"/> 由 { history.start.address } 到 { history.end.address }  
                                </p>
                                <p className="time">
                                    <i className="icon-circles"/> {moment(history.createdAt).locale('zh-HK').format('Do MMM YYYY hh:mm a')}
                                </p>
                                <div className="order-card-status-list">
                                    <div className="order-card-status-no">
                                        定單編號: {history.orderId}
                                    </div>
                                    <div 
                                        className={
                                            history.status == "accepted"?
                                                "order-card-status order-card-accepted":
                                            history.status == "confirmed"?
                                                "order-card-status order-card-confirmed":
                                            history.status == "canceled"?
                                                "order-card-status order-card-canceled":"order-card-status order-card-commented"
                                        }
                                    >
                                        {  
                                            history.status == "accepted"?
                                                "已承接":
                                            history.status == "confirmed"?
                                                "已完成":
                                            history.status == "canceled"?
                                                "已取消":"已評價"
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }

}

// <div style={{ padding:'6px 12px', width: '100%'}}>
//     <button 
//         className="btn btn-sm btn-success width100"
//     >
//         搜索 
//     </button>
// </div>