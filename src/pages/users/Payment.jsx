import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import '../styles/payment.css';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../helper';


class Payment extends Component {
    state = {
        modalDetails: false,
        modalUpload: false,
        loading: false
    };

    componentDidMount() {
        axios.get(`${API_URL}`);
    }

    toggleDetails = () => {
        this.setState({ modalDetails: !this.state.modalDetails });
    };

    toggleUpload = () => {
        this.setState({ modalUpload: !this.state.modalUpload });
    };

    renderDetails = () => {

    };

    uploadPayment = () => {

    };

    render() {
        return (
            <>
                {/* MODAL DETAILS */}
                <Modal isOpen={this.state.modalDetails} toggle={this.toggleDetails} centered>
                    <ModalHeader toggle={this.toggleDetails}>Payment Details</ModalHeader>
                    <ModalBody>

                    </ModalBody>
                </Modal>

                {/* MODAL UPLOAD PAYMENT */}
                <Modal isOpen={this.state.modalUpload} toggle={this.toggleUpload} centered>
                    <ModalHeader toggle={this.toggleUpload}>Upload Your Payment</ModalHeader>
                    <ModalBody></ModalBody>
                    <ModalFooter>
                        <button className="btn-upload">Upload</button>
                        <button className='btn-cancel'>Cancel</button>
                    </ModalFooter>
                </Modal>
                <Container className='container-1'>
                    <div className='container-2'>
                        <div className='box-1'>
                            <div>Finish your payment</div>
                        </div>
                        <div className='box-2'>
                            <div>Bank</div>
                            <div>Logo</div>
                        </div>
                        <div className='box-3'>
                            <div className='box-3-x'>
                                <div>
                                    <div className='judul'>Bank Account</div>
                                    <div className='nomor'>73284234</div>
                                </div>
                            </div>
                            <div className='box-3-x'>
                                <div>
                                    <div className='judul'>Total Amount</div>
                                    <div className='nomor'>Rp 3.000.000,-</div>
                                </div>
                                <div className='detail' onClick={this.toggleDetails}>Details</div>
                            </div>
                        </div>
                        <div className='box-4'>
                            <Link to='/'>
                                <button className='btn-1'>Shop Again</button>
                            </Link>
                            <button className='btn-2' onClick={this.toggleUpload}>Upload Payment</button>
                        </div>
                    </div>

                </Container>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        dataUser: state.Auth
    };
};

export default connect(mapStateToProps)(Payment);