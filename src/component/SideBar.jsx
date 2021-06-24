import React, { Component } from 'react';
import { BiCog } from 'react-icons/bi';
import { FaUserAlt, FaPen } from 'react-icons/fa';
import { AiFillHeart } from 'react-icons/ai';
import { CgNotes } from 'react-icons/cg';
import { BsFillLockFill } from 'react-icons/bs';
import "../pages/styles/userProfile.css";



class Sidebar extends Component {

    render() {
        return (
            <div>
                <div className="row p-0">
                    <div className="col-md-2 pt-5 pl-5 back-ground font1">
                        <BiCog className="icon" />
                        <div className="mt-5 d-flex">
                            <div><FaUserAlt /></div>
                            <div className="pl-2 pt-1">Profile</div>
                        </div>
                        <div className="mt-3 d-flex">
                            <div><CgNotes /></div>
                            <div className="pl-2 pt-1">History</div>
                        </div>
                        <div className="mt-3 d-flex">
                            <div><AiFillHeart /></div>
                            <div className="pl-2 pt-1">Wishlist</div>
                        </div>
                    </div>
                    <div className="col-md-10">
                        <div className="px-5">
                            <h1 className="my-profile mt-5">My Profile</h1>
                        </div>
                        <div className="row pt-3 pl-5 mt-5">
                            <div className="col-md-2 font2">
                                <div className="mt-3 d-flex">
                                    <div><FaPen /></div>
                                    <div className="pl-2 pt-1" style={{ color: this.props.page === "profile" ? "black" : "gray" }}>Edit Profile</div>
                                </div>
                                <div className="mt-3 d-flex">
                                    <div><BsFillLockFill /></div>
                                    <div className="pl-2 pt-1" style={{ color: this.props.page === "security" ? "black" : "gray" }}>Security</div>
                                </div>
                                <div className="mt-3 d-flex">
                                    <div><BsFillLockFill /></div>
                                    <div className="pl-2 pt-1" style={{ color: this.props.page === "address" ? "black" : "gray" }}>Address</div>
                                </div>
                            </div>
                            <div className="col-md-5 px-5 pt-4">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};


export default Sidebar;