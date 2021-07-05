import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import '../styles/payment.css';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL, currencyFormatter } from '../../helper';
import BCA from '../../images/BCALogo.png';
import LoaderComp from '../../components/Loader';


class Payment extends Component {
    state = {
        modalDetails: false,
        modalUpload: false,
        loading: false,
        photo: null,
        orders: [],
        orders_id: 0,
        orders_detail: [],
        ongkir: 0,
        total: 0
    };

    componentDidMount() {
        axios.get(`${API_URL}/transaction/history/${this.props.dataUser.id}`)
            .then((res) => {
                console.log(res.data);
                this.setState({ orders: res.data });
            }).catch((error) => {
                console.error(error);
            });
    }

    toggleDetails = (orders_id, index) => {
        this.setState({ loading: true, modalDetails: !this.state.modalDetails });
        axios.get(`${API_URL}/transaction/ordersdetail/${orders_id}`)
            .then((res) => {
                console.log('ini orders detail', res.data);
                this.setState({ orders_detail: res.data, loading: false, ongkir: this.state.orders[index].ongkir, total: this.state.orders[index].total });
            }).catch((error) => {
                console.error(error);
                this.setState({ loading: false, modalDetails: !this.state.modalDetails });
            });

    };

    toggleUpload = (orders_id) => {
        this.setState({ modalUpload: !this.state.modalUpload, photo: null, orders_id: orders_id });
    };

    toggle = () => {
        this.setState({ modalDetails: !this.state.modalDetails });
    };

    addFileChange = (e) => {
        console.log(e.target.files);
        if (e.target.files[0]) {
            this.setState({ photo: e.target.files[0] });
        } else {
            this.setState({ photo: null });
        }
    };

    renderDetails = () => {
        if (this.state.loading) {
            return <LoaderComp />;
        }
        return this.state.orders_detail.map((val, index) => {
            return (
                <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: '600' }}>{val.productName}</div>
                        <div style={{ color: 'gray' }}>{currencyFormatter(val.amount)}</div>
                    </div>
                    <div style={{ color: 'gray' }}>{val.quantity} X {currencyFormatter(val.price)}</div>
                </div>
            );
        });
    };

    uploadPayment = () => {
        let formData = new FormData();
        formData.append('photo', this.state.photo);
        let data = {
            users_id: this.props.dataUser.id
        };
        formData.append('data', JSON.stringify(data));
        const orders_id = this.state.orders_id;
        let tokenAccess = localStorage.getItem('TA');
        axios.post(`${API_URL}/transaction/uploadpayment/${orders_id}`, formData, {
            headers: {
                'Content-Type': "multipart/form-data",
                Authorization: 'Bearer ' + tokenAccess
            }
        }).then((res) => {
            alert('berhasil');
            this.setState({ orders: res.data, modalUpload: false, photo: null });
        }).catch((error) => {
            console.error(error);
        });

    };

    renderPayment = () => {
        return this.state.orders.map((val, index) => {
            return (
                <div key={index} className='container-2'>
                    <div className='box-2'>
                        <div>{val.name}</div>
                        <div>
                            {/* <img
                                src={BCA}
                                alt='icon'
                                className='icon-bank'
                            /> */}
                        </div>
                    </div>
                    <div className='box-3'>
                        <div className='box-3-x'>
                            <div>
                                <div className='judul'>Bank Account</div>
                                <div className='nomor'>{val.account_number}</div>
                            </div>
                        </div>
                        <div className='box-3-x'>
                            <div>
                                <div className='judul'>Total Amount</div>
                                <div className='nomor'>{currencyFormatter(val.total + val.ongkir)}</div>
                            </div>
                            <div className='detail' onClick={() => this.toggleDetails(val.id, index)}>Details</div>
                        </div>
                    </div>
                    <div className='box-4'>
                        <button className='btn-2' onClick={() => this.toggleUpload(val.id)}>Upload Payment</button>
                    </div>
                </div>
            );
        });
    };



    render() {
        return (
            <React.Fragment>
                {this.state.loading ? <LoaderComp /> : null}
                {/* MODAL DETAILS */}
                <Modal isOpen={this.state.modalDetails} toggle={this.toggle} centered>
                    <ModalHeader toggle={this.toggle}>
                        <div style={{ marginLeft: '150px', color: '#052c43', fontWeight: '650' }}>
                            Payment Details
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {this.renderDetails()}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: 'gray', borderBottom: '1px solid gray' }}>
                            <div>
                                Ongkos Kirim
                            </div>
                            <div>
                                {currencyFormatter(this.state.ongkir)}
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', marginTop: '15px' }}>
                            <div>
                                Grand Total
                            </div>
                            <div>
                                {currencyFormatter(this.state.total + this.state.ongkir)}
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

                {/* MODAL UPLOAD PAYMENT */}
                <Modal isOpen={this.state.modalUpload} toggle={this.toggleUpload} centered>
                    <ModalHeader toggle={this.toggleUpload}>
                        <div style={{ marginLeft: '130px', color: '#052c43', fontWeight: '650' }}>
                            Upload Your Payment
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {this.state.photo ?
                            <img
                                style={{ marginLeft: '80px', height: '200px' }}
                                src={URL.createObjectURL(this.state.photo)}
                                alt='photo'
                            />
                            :
                            null
                        }
                        <input
                            type='file'
                            // placeholder='Input payment'
                            className='form-control mt-3'
                            onChange={this.addFileChange}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn-upload" onClick={this.uploadPayment} >Upload</button>
                        <button className='btn-cancel' onClick={this.toggleUpload}>Cancel</button>
                    </ModalFooter>
                </Modal>
                <Container className='container-1'>
                    <div className='box-1'>
                        <div>Finish your payment</div>
                    </div>
                    {this.renderPayment()}
                </Container>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        dataUser: state.Auth
    };
};

export default connect(mapStateToProps)(Payment);;