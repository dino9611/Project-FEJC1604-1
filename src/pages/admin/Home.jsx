import React, { Component } from 'react';
import { connect } from 'react-redux';

class HomeAdmin extends Component {
    state = {

    };

    render() {
        if (this.props.dataAdmin.islogin) {
            return (
                <div>
                    <h1>HOME ADMIN</h1>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        dataAdmin: state.Auth
    };
};

export default connect(mapStateToProps)(HomeAdmin);