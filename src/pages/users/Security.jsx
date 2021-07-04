import React, { Component } from "react";
import Sidebar from "../../components/SideBar";
import '../../components/styles/Security.css';
import { Container } from 'reactstrap';
import axios from 'axios';
import { API_URL } from '../../helper';
import { connect } from 'react-redux';

class Security extends Component {
  state = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  componentDidMount() {
    console.log('ini adalah uid', this.props.dataUser.uid);
  }

  onInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    // console.log(event.target.name);
    // console.log(event.target.value);
  };

  saveClick = () => {
    const { newPassword, confirmPassword } = this.state;
    if (newPassword !== confirmPassword) {
      alert('new pass & confirm pass tidak sama');
    } else {
      let newPass = {
        password: newPassword
      };
      axios.patch(`${API_URL}/password/change/${this.props.dataUser.id}`, newPass)
        .then((res) => {
          console.log(res.data);
          // this.setState({});
        }).catch((error) => {
          console.error(error);
          alert('gagal');
        });
    }
  };


  render() {
    return (
      <div>
        <Sidebar page="security">
          <Container>
            <h1>Security</h1>
            <div>
              <div style={{ marginTop: '20px' }}>
                <label className='form-judul'>Old Password</label>
                <div className='kotak-pass'>
                  <input
                    type='password'
                    name='oldPassword'
                    className='pass-input'
                    onChange={this.onInputChange}

                  />
                </div>
              </div>
              <div>
                <label className='form-judul'>New Password</label>
                <div className='kotak-pass'>
                  <input
                    type='password'
                    name='newPassword'
                    className='pass-input'
                    onChange={this.onInputChange}
                  />
                </div>
              </div>
              <div>
                <label className='form-judul'>Confirm New Password</label>
                <div className='kotak-pass'>
                  <input
                    type='password'
                    name='confirmPassword'
                    className='pass-input'
                    onChange={this.onInputChange}

                  />
                </div>
              </div>
            </div>
            <div className='btn-save'>
              <button className='btn-save1' onClick={this.saveClick}>Save</button>
            </div>
          </Container>
        </Sidebar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataUser: state.Auth
  };
};

export default connect(mapStateToProps)(Security);
