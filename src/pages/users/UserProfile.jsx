import React, { Component } from 'react';
import { API_URL } from '../../helper';
import axios from 'axios';
import Header from '../../component/Header';
import { Container } from 'react-bootstrap';



class UserProfile extends Component {
    state = {
        dataUser: {
            first_name: "",
            last_name: "",
            email: "",
            username: "",
            id: 0
        }
    };

    componentDidMount() {
        axios
            .get(`${API_URL}/users/${this.state.id}`)
            .then((res) => {
                console.log(res.data[0]);
                this.setState({ dataUser: res.data });
            })
            .catch((err) => {
                console.error(err);
            });
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
                                className="form-control"
                                placeholder="First Name"
                            />
                            <input
                                className="form-control"
                                placeholder="Last Name"
                            />
                        </div>
                        <input
                            className="form-control mt-3"
                            placeholder="Username"
                        />
                        <input
                            className="form-control mt-3"
                            placeholder="Email Address"
                        />
                        <div className="d-flex mt-5">
                            <button className="btn btn-primary">Save</button>
                            <button className="btn btn-secondary">Cancel</button>
                        </div>
                    </form>
                </Container>
            </div>
        );
    };
};

export default UserProfile;