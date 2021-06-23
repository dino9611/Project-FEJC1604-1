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

class AddressList extends Component {
    state = {};
    render() {
        return (
            <div>
                <Header />
                <Container>
                    <h1>Address List</h1>
                    <Modal>

                    </Modal>
                </Container>
            </div>
        );
    }
}

export default AddressList;