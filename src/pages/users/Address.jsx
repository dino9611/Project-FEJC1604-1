import React, { Component } from 'react';
import Header from '../../component/Header';
import {
    Table,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    InputGroup,
    Button as ButtonStrap,
    Pagination,
    PaginationItem,
    CustomInput,
    Container
} from "reactstrap";
import axios from "axios";
import Sidebar from '../../component/SideBar';

class AddressList extends Component {
    state = {};
    render() {
        return (
            <div>
                <Sidebar page="address">

                </Sidebar>
                <Modal>

                </Modal>
            </div>
        );
    }
}

export default AddressList;