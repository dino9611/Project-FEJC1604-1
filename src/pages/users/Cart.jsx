import React, { Component } from 'react';
import Header from '../../components/Header';
import '../styles/cart.css';
import { CartAction } from '../../redux/actions';
import { connect } from 'react-redux';
import { Table, Container, Modal, ModalBody, ModalHeader, ModalFooter, Collapse } from 'reactstrap';
import { API_URL, currencyFormatter } from "../../helper";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';


class Cart extends Component {
    state = {
        modal: false,
        loading: false,
        productName: "",
        modalVisible: false,
        stockByProduct: 0,
        qtyInput: 0,
        ordersdetail_id: 0,
    };

    componentDidMount() {
        // * get data products
        console.log('ini line 24', this.props.dataUser);
    }

    toggle = () => {
        this.setState({ modalVisible: !this.state.modalVisible, qtyInput: 0, productName: "", ordersdetail_id: 0 });
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
            text: `${prodName} will be deleted`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
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

    renderAddress = () => {

    };

    render() {
        return (
            <div>
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

                <div className="cart-background">
                    <Header />
                    <div className="section-content">
                        <h1 className="title-top">Cart</h1>
                    </div>
                </div>
                <Container>
                    <Table bordered hover className="table-margin">
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
                    </Table>
                    {/* <Link to='/checkout'> */}
                    <button className="checkout-btn">Check Out</button>
                    {/* </Link> */}
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        dataUser: state.Auth
    };
};

export default connect(mapStateToProps, { CartAction })(Cart);