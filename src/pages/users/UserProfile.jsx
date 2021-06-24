import React, { Component } from 'react';
import { API_URL } from '../../helper';
import axios from 'axios';
import Header from '../../component/Header';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';



class UserProfile extends Component {
    state = {
        dataUser: {
            first_name: "",
            last_name: "",
            phone_number: "",
            age: ""
        },
        dataInit: {
            first_name: "",
            last_name: "",
            phone_number: "",
            age: ""
        },
        save: true
    };

    componentDidMount() {
        axios
            .get(`${API_URL}/auth/${this.props.Auth.id}`)
            .then((res) => {
                console.log(res.data[0]);
                this.setState({ dataUser: res.data[0], dataInit: res.data[0] });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    onInputChange = (e) => {
        let data = this.state.dataUser;
        let dataUsers = { ...data, [e.target.name]: e.target.value };
        this.setState({ dataUser: dataUsers, save: false });
    };

    onCancelClick = () => {
        let data = this.state.dataInit;
        this.setState({ dataUser: data, save: true });
    };

    onSaveClick = () => {

    };

    render() {
        return (
            <div>
                <Header />
                <Container>
                    <h1>My Profile</h1>
                    <form>
                        <div className="d-flex mt-5">
                            <input
                                name="first_name"
                                type="text"
                                className="form-control"
                                placeholder="First Name"
                                value={this.state.dataUser.first_name}
                                onChange={this.onInputChange}
                            />
                            <input
                                name="last_name"
                                className="form-control"
                                type="text"
                                placeholder="Last Name"
                                value={this.state.dataUser.last_name}
                                onChange={this.onInputChange}
                            />
                        </div>
                        <div>
                            <input
                                name="phone_number"
                                className="form-control mt-3"
                                type="text"
                                placeholder="Phone Number"
                                value={this.state.dataUser.phone_number}
                                onChange={this.onInputChange}
                            />
                            <input
                                name="age"
                                className="form-control mt-3"
                                type="number"
                                placeholder="Age"
                                value={this.state.dataUser.age}
                                onChange={this.onInputChange}
                            />

                        </div>
                        <div className="d-flex mt-5">
                            <button className="btn btn-primary" disabled={this.state.save}  >Save</button>
                            <button className="btn btn-secondary" onClick={this.onCancelClick}>Cancel</button>
                        </div>
                    </form>
                </Container>
            </div>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        Auth: state.Auth
    };
};

export default connect(mapStateToProps, {})(UserProfile);