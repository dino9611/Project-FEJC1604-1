import React, { Component } from "react";
import Sidebar from "../../components/SideBar";
import '../../components/styles/Security.css';
import { Container } from 'reactstrap';
import axios from 'axios';
import { API_URL } from '../../helper';
import { connect } from 'react-redux';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import AlertAdmin from '../../components/AlertAdmin';


class Security extends Component {
  state = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    isVisibleOld: false,
    isVisibleNew: false,
    isVisibleConf: false,
    openSnack: false,
    message: "",
    alertStatus: "",
  };

  componentDidMount() {
    console.log('ini adalah id', this.props.dataUser.id);
    // axios.get(`/changepassword`)
  }

  onInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  toggleOld = () => {
    this.setState({ isVisibleOld: !this.state.isVisibleOld });
  };

  toggleNew = () => {
    this.setState({ isVisibleNew: !this.state.isVisibleNew });
  };

  toggleConf = () => {
    this.setState({ isVisibleConf: !this.state.isVisibleConf });
  };

  handleSnack = () => {
    this.setState({ openSnack: false, message: '', alertStatus: '' });
  };


  saveClick = () => {
    const { newPassword, confirmPassword, oldPassword } = this.state;
    if (!oldPassword || !newPassword || !confirmPassword) {
      this.setState({
        message: 'All input must be filled',
        openSnack: true,
        alertStatus: 'info',
      });
    } else {
      if (newPassword !== confirmPassword) {
        this.setState({
          message: 'New password & confirm password is different',
          openSnack: true,
          alertStatus: 'warning',
        });
      } else {
        let data = {
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword
        };
        axios.patch(`${API_URL}/password/change/${this.props.dataUser.id}`, data)
          .then((res) => {
            console.log(res.data);
            this.setState({
              newPassword: '',
              confirmPassword: '',
              oldPassword: '',
              isVisibleOld: false,
              isVisibleNew: false,
              isVisibleConf: false,
              message: 'Password has successfuly changed',
              openSnack: true,
              alertStatus: 'success',
            });
          }).catch((error) => {
            console.error(error);
            this.setState({
              message: 'Old password is wrong',
              openSnack: true,
              alertStatus: 'error',
            });
          });
      }
    }
  };


  render() {
    return (
      <div>
        <Sidebar page="security">
          <Container>
            <div style={{ marginLeft: '150px', marginTop: '50px' }}>
              <div style={{ marginTop: '20px' }}>
                <label className='form-judul'>Old Password</label>
                <div className='kotak-pass-sec'>
                  <input
                    type={this.state.isVisibleOld ? 'text' : 'password'}
                    name='oldPassword'
                    className='pass-input-sec'
                    onChange={this.onInputChange}
                    value={this.state.oldPassword}
                  />
                  <div style={{ fontSize: '25px', margin: '0px 10px' }}>
                    {this.state.isVisibleOld ?
                      <AiFillEye onClick={this.toggleOld} style={{ color: '#052C43' }} />
                      :
                      <AiFillEyeInvisible onClick={this.toggleOld} style={{ color: 'gray' }} />
                    }
                  </div>
                </div>
              </div>
              <div>
                <label className='form-judul'>New Password</label>
                <div className='kotak-pass-sec'>
                  <input
                    type={this.state.isVisibleNew ? 'text' : 'password'}
                    name='newPassword'
                    className='pass-input-sec'
                    onChange={this.onInputChange}
                    value={this.state.newPassword}
                  />
                  <div style={{ fontSize: '25px', margin: '0px 10px' }}>
                    {this.state.isVisibleNew ?
                      <AiFillEye onClick={this.toggleNew} style={{ color: '#052C43' }} />
                      :
                      <AiFillEyeInvisible onClick={this.toggleNew} style={{ color: 'gray' }} />
                    }
                  </div>
                </div>
              </div>
              <div>
                <label className='form-judul'>Confirm New Password</label>
                <div className='kotak-pass-sec'>
                  <input
                    type={this.state.isVisibleConf ? 'text' : 'password'}
                    name='confirmPassword'
                    className='pass-input-sec'
                    onChange={this.onInputChange}
                    value={this.state.confirmPassword}
                  />
                  <div style={{ fontSize: '25px', margin: '0px 10px' }}>
                    {this.state.isVisibleConf ?
                      <AiFillEye onClick={this.toggleConf} style={{ color: '#052C43' }} />
                      :
                      <AiFillEyeInvisible onClick={this.toggleConf} style={{ color: 'gray' }} />
                    }
                  </div>
                </div>
              </div>
              <div className='btn-save'>
                <button className='btn-save1' onClick={this.saveClick}>Save</button>
              </div>
            </div>
          </Container>
        </Sidebar>
        <AlertAdmin
          openSnack={this.state.openSnack}
          handleSnack={this.handleSnack}
          message={this.state.message}
          status={this.state.alertStatus}
        />
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataUser: state.Auth
  };
};

export default connect(mapStateToProps)(Security);
