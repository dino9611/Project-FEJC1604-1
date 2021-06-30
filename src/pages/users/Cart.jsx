import React, { Component } from 'react';
import Header from '../../components/Header';
import '../styles/cart.css';
import { CartAction } from '../../redux/actions';
import { connect } from 'react-redux';
import { Table, Container, Modal, ModalBody, ModalHeader, ModalFooter, Alert } from 'reactstrap';
import { API_URL, currencyFormatter } from "../../helper";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast, Slide, ToastContainer } from 'react-toastify';
import emptyCart from '../../images/empty-cart.svg';
import * as geolib from 'geolib';

class Cart extends Component {
    state = {
        modal: false,
        loading: false,
        productName: "",
        stockByProduct: 0,
        qtyInput: 0,
        ordersdetail_id: 0,
        addresses: [],
        selected_address: {
            address: "",
            city: "",
            zip: "",
        },
        modalVisible: false,
        modalAddress: false,
        modalPayment: false,
        banks: [],
        pilihanId: 0,
        warehouses: [],
        selected_warehouse: 0
    };

    componentDidMount() {
        console.log('ini dataUser', this.props.dataUser);
        axios.get(`${API_URL}/auth/address/${this.props.dataUser.id}`)
            .then((res) => {
                console.log('ini addresses', res.data);
                this.setState({ addresses: res.data, selected_address: res.data[0] });
                console.log('ini selected_address', this.state.selected_address);
            }).catch((error) => {
                console.error(error);
            });
        axios.get(`${API_URL}/transaction/bank`)
            .then((res) => {
                // console.log('ini bank', res.data);
                this.setState({ banks: res.data });
                console.log('banks', this.state.banks);
            }).catch((error) => {
                console.error('ini error', error);
            });
    }

    toggle = () => {
        this.setState({ modalVisible: !this.state.modalVisible, qtyInput: 0, productName: "", ordersdetail_id: 0 });
    };

    toggleAddress = () => {
        this.setState({ modalAddress: !this.state.modalAddress });
    };

    toggleEdit = async (val) => {
        // pas klik edit nge get data availableToUser untuk barang tersebut
        try {
            const prod_id = val.product_id;
            const result = await axios.get(`${API_URL}/transaction/stockbyproduct/${prod_id}`);
            this.setState({
                stockByProduct: result.data.availableToUser,
                productName: val.name,
                modalVisible: !this.state.modalVisible,
                qtyInput: val.qty,
                ordersdetail_id: val.ordersdetail_id
            });
        } catch (error) {
            console.error(error);
        }

    };

    togglePayment = () => {
        this.setState({ modalPayment: !this.state.modalPayment });
    };

    updateQtyClick = () => {
        const users_id = this.props.dataUser.id;
        const { qtyInput, ordersdetail_id, stockByProduct } = this.state;
        let data = {
            users_id: users_id,
            ordersdetail_id: ordersdetail_id,
            qty: qtyInput
        };
        if (qtyInput > stockByProduct) {
            toast.error('Qty input over!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        } else {
            axios.patch(`${API_URL}/transaction/editqty`, data)
                .then((res) => {
                    this.props.CartAction(res.data);
                    this.toggle();
                }).catch((error) => {
                    console.error(error);
                });
        }

    };

    deleteItemClick = (index) => {
        let prodName = this.props.dataUser.cart[index].name;
        let tokenAccess = localStorage.getItem("TA");
        let option = {
            headers: {
                Authorization: 'Bearer ' + tokenAccess
            }
        };
        Swal.fire({
            title: 'Are you sure?',
            text: `${prodName} will be deleted from your cart`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then((result) => {
            if (result.isConfirmed) {
                let ordersdetail_id = this.props.dataUser.cart[index].ordersdetail_id;
                let users_id = this.props.dataUser.id;
                axios.delete(`${API_URL}/transaction/deletecart/${ordersdetail_id}/${users_id}`, option)
                    .then((res) => {
                        this.props.CartAction(res.data);
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        );
                    }).catch((error) => {
                        console.error(error);
                    });
            }
        });

    };

    renderCart = () => {
        return this.props.dataUser.cart.map((val, index) => {
            return (
                <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{val.name}</td>
                    <td>
                        <img src={API_URL + val.image} alt={val.name} width="200px" height="150px" />
                    </td>
                    <td className="text-center">{currencyFormatter(val.price)}</td>
                    <td className="text-center">{val.qty}</td>
                    <td className="text-center">{currencyFormatter(val.price * val.qty)}</td>
                    <td className="text-center">
                        <FiEdit onClick={() => this.toggleEdit(val)} className="edit-btn" />
                        <FiTrash2 onClick={() => this.deleteItemClick(index)} className="delete-btn" />
                    </td>
                </tr>
            );
        });
    };

    renderCart2 = () => {
        return this.props.dataUser.cart.map((val, index) => {
            return (
                <div key={index} className="box-cart">
                    <div style={{
                        // border: '1px solid black', 
                        padding: '10px 10px 10px 10px'
                    }}>
                        <div style={{ fontWeight: '600' }}>{`Pesanan ${index + 1}`}</div>
                        <div style={{ display: 'flex', paddingTop: '10px', paddingBottom: '10px' }}>
                            <div style={{
                                // background: 'yellow', 
                                flex: 2
                            }}>
                                <div style={{ display: 'flex' }}>
                                    <div style={{
                                        border: '1px solid black', borderRadius: '7px',
                                        // background: 'gray' 
                                    }}>
                                        <img src={API_URL + val.image} alt={val.name} width="150px" height="150px" />
                                    </div>
                                    <div style={{
                                        // background: 'green',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '20px'
                                    }}>
                                        <div style={{ fontWeight: '700' }}>{val.name}</div>
                                        <div style={{
                                            // color: 'gray' 
                                        }}>{val.qty} {val.qty > 1 ? 'items' : 'item'} x {currencyFormatter(val.price)}</div>
                                        <div style={{
                                            display: 'flex',
                                            // background: 'purple', 
                                            marginTop: '10px'
                                        }}>
                                            <div> <FiEdit onClick={() => this.toggleEdit(val)} className="edit-btn" /> </div>
                                            <div> <FiTrash2 onClick={() => this.deleteItemClick(index)} className="delete-btn" /> </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                // background: 'teal',
                                flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '50px', borderLeft: '2px solid #DBDEE2'
                            }}>
                                <div style={{
                                    // background: 'tomato', 
                                    display: 'flex', flexDirection: 'column',
                                }}>
                                    <div style={{
                                        // color: 'gray'
                                    }}>
                                        Subtotal
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{currencyFormatter(val.price * val.qty)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            );
        });
    };

    renderTotal = () => {
        let total = 0;
        this.props.dataUser.cart.forEach((val) => {
            total += val.price * val.qty;
        });
        return total;
    };

    onInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    renderAddressOptions = () => {
        return this.state.addresses.map((val, index) => {
            return (
                <div key={index} style={{ color: 'gray', display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                        <div> {val.address}</div>
                        <div>{val.city + ', ' + val.zip}</div>
                        <div style={{ color: "#89ADC3" }}>{val.is_default ? '(Default address)' : null}</div>
                        <br />
                    </div>
                    <div>
                        {this.state.selected_address.id === this.state.addresses[index].id ?
                            <div style={{ color: "#052C43", marginRight: '12px', paddingTop: '15px', paddingBottom: '10px' }}>Selected</div>
                            :
                            <button
                                style={{ flex: 1, justifyContent: "space-between", marginTop: '5px', paddingBottom: '10px' }}
                                className="modal-btn1"
                                onClick={() => this.selectAddressClick(index)}
                            >
                                Select
                            </button>
                        }
                    </div>
                </div>
            );
        });
    };

    selectAddressClick = (index) => {
        // ketika tekan select akan mengubah this.state.selected_address dengan this.state.addresses[index]
        this.setState({ selected_address: this.state.addresses[index], modalAddress: !this.state.modalAddress });
        toast.dark('Address successfuly changed', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            transition: Slide
        });

    };

    renderBanks = () => {
        return this.state.banks.map((val, index) => {
            return (
                <label key={index} className="mx-2">
                    <input
                        type="radio"
                        name="pilihanId"
                        onChange={this.onInputChange}
                        checked={this.state.pilihanId == val.id}
                        value={val.id}
                        className="mr-2"
                    />
                    {val.name}: {val.account_number}
                </label>
            );
        });
    };

    checkOutClick = () => {
        const users_id = this.props.dataUser.id;
        const address_id = this.state.selected_address.id;
        const bank_id = this.state.pilihanId;
        const users_latitude = this.state.selected_address.latitude;
        const users_longitude = this.state.selected_address.longitude;
        const orders_id = this.props.dataUser.cart[0].orders_id;

        if (!bank_id) {
            alert('harus di isi');
        } else {
            let body = {
                bank_id: bank_id,
                address_id: address_id,
                users_id: users_id,
                users_latitude: users_latitude,
                users_longitude: users_longitude,
                orders_id: orders_id
            };
            let tokenAccess = localStorage.getItem("TA");
            let options = {
                header: {
                    Authorization: "Bearer " + tokenAccess
                }
            };
            axios.post(`${API_URL}/transaction/checkout`, body, options)
                .then((res) => {
                    this.setState({ modalPayment: !this.state.modalPayment });
                    this.props.CartAction(res.data);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Your work has been saved',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }).catch((error) => {
                    console.error(error);
                });
        }
    };

    getDistance = () => {
        // ketika user klick check out, dari FE akan mengirimkan address_id, bank_id, warehouse_id ke BE
        // warehouse_id didapat dengan membandingkan (lat, lng) 5 location dengan (lat, lng) pada selected_address user
        // warehouse_id adalah id warehouse yang TERDEKAT dengan selected_address users
        const lat_user = this.state.selected_address.latitude;
        const lng_user = this.state.selected_address.longitude;
        const lat1 = this.state.warehouses[0].latitude;
        const lng1 = this.state.warehouses[0].longitude;
        const lat2 = this.state.warehouses[1].latitude;
        const lng2 = this.state.warehouses[1].longitude;
        const lat3 = this.state.warehouses[2].latitude;
        const lng3 = this.state.warehouses[2].longitude;
        const lat4 = this.state.warehouses[3].latitude;
        const lng4 = this.state.warehouses[3].longitude;
        const lat5 = this.state.warehouses[4].latitude;
        const lng5 = this.state.warehouses[4].longitude;

        const nearest = geolib.findNearest({ lat_user, lng_user }, [
            { lat1, lng1 }, { lat2, lng2 }, { lat3, lng3 },
            { lat4, lng4 }, { lat5, lng5 }
        ]);
        console.log('ini terdekat', nearest);
        const longitude = nearest.lng1.toString();
        console.log(longitude);
    };

    render() {
        return (
            <div>
                {/* Modal QTY */}
                <Modal isOpen={this.state.modalVisible} toggle={this.toggle} centered>
                    <ModalHeader>Edit Qty {this.state.productName}</ModalHeader>
                    <ModalBody>
                        Stock Available {this.state.stockByProduct}
                        <div>
                            <input
                                name="qtyInput"
                                placeholder="Input quantity"
                                className="form-control"
                                onChange={this.onInputChange}
                                value={this.state.qtyInput}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="modal-btn1" onClick={this.updateQtyClick}>Update</button>
                        <button className="modal-btn2" onClick={this.toggle}>Cancel</button>
                    </ModalFooter>
                </Modal>

                {/* Modal Choose Address */}
                <Modal isOpen={this.state.modalAddress} toggle={this.toggleAddress} centered >
                    <ModalHeader>
                        <div className="modaladd-font" >
                            <div>Select Shipment Address</div>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {this.renderAddressOptions()}
                    </ModalBody>
                </Modal>

                {/* Modal Payment */}
                <Modal isOpen={this.state.modalPayment} toggle={this.togglePayment} centered>
                    <ModalHeader>Payment Method</ModalHeader>
                    <ModalBody>
                        <div style={{ display: "flex" }}>
                            <div style={{ flex: 1 }}>
                                Your Total Payment:
                            </div>
                            <div style={{ flex: 1 }}>
                                {currencyFormatter(this.renderTotal())}
                            </div>
                        </div>
                        <br />
                        <div>
                            {this.renderBanks()}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="modal-btn1" onClick={this.checkOutClick}>Check Out</button>
                        <button className="modal-btn2" onClick={this.togglePayment}>Cancel</button>
                    </ModalFooter>
                </Modal>

                <div className="cart-background">
                    <Header />
                    <div className="section-content">
                        <h1 className="title-top">Cart</h1>
                    </div>
                </div>
                <Container>
                    {!this.props.dataUser.cart.length ?
                        <div className="container-cart">
                            <div style={{ flex: 1 }}>
                                <img
                                    src={emptyCart}
                                    alt="empty-cart-icon"
                                    className="center-cart"
                                />
                            </div>
                            <div style={{ flex: 1, marginTop: "15px" }}>
                                <h2>Your Cart is Empty</h2>
                                <Link to='/'>
                                    <buton className="tombol-home">Shop Now</buton>
                                </Link>
                            </div>
                        </div>
                        :
                        <>
                            <h5 style={{ marginTop: "35px" }}>Shipping Address:</h5>
                            <div className="alamat-box" >
                                <div style={{ fontWeight: "700" }}>
                                    {this.props.dataUser.first_name + ' ' + this.props.dataUser.last_name}
                                </div>
                                {this.props.dataUser.phone_number}
                                <br />
                                <div style={{ color: 'gray' }}>
                                    {this.state.selected_address.address}
                                    <br />
                                    {this.state.selected_address.city + ', ' + this.state.selected_address.zip}
                                </div>
                                <div style={{ color: "#89ADC3" }}>
                                    {this.state.selected_address.is_default ? 'Default address' : null}
                                </div>
                            </div>
                            <button className="other-address" onClick={this.toggleAddress}>Choose Other Address</button>
                            <button className="other-address" onClick={this.getDistance}>Geolib</button>
                            <div style={{ border: '4px solid #F3F4F5', marginTop: '20px' }}></div>
                            <div className="table-margin">
                                {this.renderCart2()}
                            </div>
                            {/* <Table bordered hover className="table-margin">
                                <tr className="text-center">
                                    <th>No</th>
                                    <th>Product Name</th>
                                    <th>Image</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Sub-Total</th>
                                    <th>Action</th>
                                </tr>
                                <tbody>
                                    {this.renderCart()}
                                    <tr className="text-center">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>Total</td>
                                        <td>{currencyFormatter(this.renderTotal())}</td>
                                        <td>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table> */}
                            <button className="checkout-btn" style={{ marginTop: '20px' }} onClick={this.togglePayment}>Choose Payment</button>
                        </>
                    }
                </Container>
            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        dataUser: state.Auth
    };
};

export default connect(mapStateToProps, { CartAction })(Cart);;;