import React, { Component, Fragment } from 'react';
import Header from '../../components/Header';
import axios from 'axios';
import '../styles/wishlist.css';
import {
    Card, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle, Container,
    Col, Row, CardImg, CardImgOverlay
} from 'reactstrap';
import { API_URL, currencyFormatter } from '../../helper';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import AlertAdmin from '../../components/AlertAdmin';
import { FaHeart } from 'react-icons/fa';
import LoaderComp from '../../components/Loader';
import Swal from "sweetalert2";
import wishlist from '../../images/wishlist.svg';

class Wishlist extends Component {
    state = {
        loading: false,
        wishlist: [],
        openSnack: false,
        message: "",
        alertStatus: "",
    };

    componentDidMount() {
        console.log(this.props.dataUser.id);
        this.setState({ loading: true });
        axios.get(`${API_URL}/auth/getwish/${this.props.dataUser.id}`)
            .then((res) => {
                this.setState({ wishlist: res.data, loading: false });
                console.log('ini wish', this.state.wishlist);
            }).catch((error) => {
                console.error(error);
                this.setState({
                    message: error.response.data.message,
                    openSnack: true,
                    alertStatus: 'error',
                });
            });
    }

    handleSnack = () => {
        this.setState({ openSnack: false, message: '', alertStatus: '' });
    };

    renderWish = () => {
        return this.state.wishlist.map((val, index) => {
            return (
                <Col sm='3' key={index}>
                    <Card style={{ marginTop: '15px', marginBottom: '15px' }}>
                        <CardBody>
                            <CardTitle tag="h5">{val.name}</CardTitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">{val.category_name}</CardSubtitle>
                        </CardBody >
                        <div style={{ height: '250px', overflow: 'hidden' }}>
                            <CardImg src={API_URL + val.image} alt="image-product" />
                        </div>
                        <CardBody>
                            <CardText>{currencyFormatter(val.price)}</CardText>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <FaHeart className='heart-wish' onClick={() => this.removeClick(index)} />
                                <Link
                                    className="normal-link-collection"
                                    to={{ pathname: `/productDetail/${val.id}`, state: { product: val } }}
                                >
                                    <button className='tombol-detail-wsh'>
                                        Details
                                    </button>
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            );
        });
    };

    removeClick = (index) => {
        let wishlist = this.state.wishlist;
        Swal.fire({
            title: `Are you sure want to remove ${wishlist[index].name} ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#F50057",
            confirmButtonText: "Remove from wishlist",
        }).then((result) => {
            if (result.isConfirmed) {
                let wish_id = wishlist[index].wish_id;
                axios
                    .delete(
                        `${API_URL}/auth/removewish/${this.props.dataUser.id}/${wish_id}`
                    )
                    .then((res) => {
                        this.setState({
                            wishlist: res.data,
                            message: 'Item removed from wishlist',
                            openSnack: true,
                            alertStatus: 'success',
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                        this.setState({
                            message: error.response.data.message,
                            openSnack: true,
                            alertStatus: 'error',
                        });
                    });
            }
        });
    };

    render() {
        return (
            <div>
                {this.state.loading ? <LoaderComp /> : null}
                <Header />
                <Container style={{ marginBottom: '100px' }}>
                    {!this.state.wishlist.length ? (
                        <div className="container-wish">
                            <div style={{ flex: 1 }}>
                                <img
                                    src={wishlist}
                                    alt="wishlist-icon"
                                    className="center-wish"
                                />
                            </div>
                            <div className='kotak-bawah-wish'>
                                <h2 style={{ color: '#052C43' }}>Your don't have any wishlist</h2>
                                <Link to="/collection">
                                    <buton className="tombol-home-wish">But, you must!</buton>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <Fragment>
                            <div className='judul-wish'>
                                Wishlist <FaHeart style={{ color: '#F50057', marginBottom: '7px' }} />
                            </div>
                            <div className='kotak-wish'>
                                <Row>
                                    {this.renderWish()}
                                </Row>
                            </div>
                        </Fragment>
                    )}
                </Container>
                <AlertAdmin
                    openSnack={this.state.openSnack}
                    handleSnack={this.handleSnack}
                    message={this.state.message}
                    status={this.state.alertStatus}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        dataUser: state.Auth,
    };
};

export default connect(mapStateToProps)(Wishlist);