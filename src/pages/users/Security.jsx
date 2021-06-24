import React, { Component } from 'react';
import { API_URL } from '../../helper';
import axios from 'axios';
import { connect } from 'react-redux';
import "../styles/userProfile.css";
import Sidebar from '../../component/SideBar';

class Security extends Component {
    state = {};
    render() {
        return (
            <div>
                <Sidebar page="security">

                </Sidebar>
            </div>
        );
    }
}

export default Security;