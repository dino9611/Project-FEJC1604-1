import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/userVerified.css';
import ntfndIcon from "../images/error.svg";

class NotFound extends Component {
    state = {};
    render() {
        return (
            <div>
                <div className="verified-container">
                    <div className="verified-content">
                        <div className="center-content">
                            <img
                                src={ntfndIcon}
                                alt="not-found-icon"
                                className="sccflyIcon"
                            />
                            <h1 className="verified-text-2">
                                Opps! sorry this page isn't available.
                            </h1>
                            <br />
                            <p>
                                The link you followed may be broken, or the page may have been
                                removed.
                            </p>
                            <Link
                                to="/"
                                style={{
                                    textDecoration: "none",
                                    color: "#125D98",
                                }}
                            >
                                Back to Home Page
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotFound;