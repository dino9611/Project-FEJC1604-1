import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LogoutAction } from '../redux/actions';
import './styles/HeaderAdmin.css';


class HeaderAdmin extends Component {
    state = {};

    componentDidMount() {
        // console.log('ini data admin', this.props.dataAdmin);
    }

    onLogoutClick = () => {
        localStorage.removeItem("TA");
        localStorage.removeItem("TR");
        localStorage.removeItem("data");
        this.props.LogoutAction();
    };

    render() {
        return (
            <div>
                <div style={{ background: '#052c43', height: '5vh', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'white', marginLeft: '5%', fontSize: '20px' }}>
                        Fournir Admin
                    </div>
                    <div style={{ marginRight: '5%' }} >
                        <button className='logout' onClick={this.onLogoutClick} >
                            Logout
                        </button>
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        dataAdmin: state.Auth
    };
};


export default connect(mapStateToProps, { LogoutAction })(HeaderAdmin);