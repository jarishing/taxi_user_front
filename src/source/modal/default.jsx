import React from 'react';

class Default extends React.Component {

    render(){
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
                    <h4 className="modal-title">Modal Header</h4>
                </div>
                <div className="modal-body">
                    <p>Some text in the modal.</p>
                </div>
                <div className="modal-footer">
                    <button 
                        type="button" 
                        className="btn btn-default"
                        onClick={ this.props.close }
                    >
                        Close
                    </button>
                </div>
            </div>
        );

    }
}

export default Default;