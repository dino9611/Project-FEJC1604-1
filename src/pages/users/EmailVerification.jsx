import React, { useState, useEffect } from "react";
import { API_URL } from "../../helper/API";
import { Link } from "react-router-dom";
import { ButtonBase } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import sccflyIcon from "../../checked.svg";
import ntfndIcon from "../../error.svg";
import timeIcon from "../../time-left.svg";
import Loader from "react-loader-spinner";
import "../styles/userVerified.css";

const EmailVerification = (props) => {
  const [Loading, setLoading] = useState(true);
  const [berhasil, setberhasil] = useState(true);
  const [messageVerified, setmessageVerified] = useState(false);
  const [isverified, setisverified] = useState(false);
  const [cekIsverified, setcekIsverified] = useState(false);
  const [resendEmail, setresendEmail] = useState(false);

  useEffect(() => {
    let token = props.match.params.token;
    axios
      .get(`${API_URL}/auth/verified-email`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (res.data.message) {
          setmessageVerified(true);
        }
      })
      .catch((err) => {
        if (isverified === false) {
          setisverified(true);
          setcekIsverified(true);
        }
        setberhasil(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // uid, email, role, username
  const sendmail = () => {
    let data = localStorage.getItem("data");
    data = JSON.parse(data);
    let datapost = {
      uid: data.uid,
      role: data.role,
      email: data.email,
      username: data.username,
    };
    axios
      .post(`${API_URL}/auth/sendverified`, datapost)
      .then((res) => {
        setresendEmail(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return berhasil ? (
    messageVerified ? (
      Loading ? (
        <div className="login-loading">
          <Loader
            type="TailSpin"
            color="#052C43"
            height={100}
            width={100}
            timeout={5000}
          />
        </div>
      ) : (
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
              <p>
                The link you followed may be broken, or the page may have been
                removed.
              </p>
            </div>
          </div>
        </div>
      )
    ) : Loading ? (
      <div className="login-loading">
        <Loader
          type="TailSpin"
          color="#052C43"
          height={100}
          width={100}
          timeout={5000}
        />
      </div>
    ) : (
      <div className="verified-container">
        <div className="verified-content">
          <div className="center-content">
            <img src={sccflyIcon} alt="sccfly-icon" className="sccflyIcon" />
            <h1 className="verified-text-1">
              {berhasil ? "Verified!" : "loading"}
            </h1>
            <p>Wowwee! You have successfuly verified the account.</p>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#125D98",
              }}
            >
              Back to Fournir
            </Link>
          </div>
        </div>
      </div>
    )
  ) : isverified && cekIsverified ? (
    <div className="verified-container">
      <div className="verified-content">
        <div className="center-content">
          <img src={timeIcon} alt="timeIcon-icon" className="timeIcon" />
          <h1 className="verified-text-1">Your session has expired.</h1>
          <p>Please click the button below to request a resend email.</p>
          <ButtonBase
            onClick={sendmail}
            disableRipple
            style={{
              width: "100%",
              backgroundColor: "#fb3640",
              color: "white",
              padding: 15,
              marginTop: 15,
              fontSize: "15px",
              letterSpacing: 0.3,
            }}
          >
            Resend email
          </ButtonBase>
          {resendEmail ? (
            <Alert severity="success" style={{ marginTop: "15px" }}>
              Email sent successfully
            </Alert>
          ) : null}
        </div>
      </div>
    </div>
  ) : (
    <div className="verified-container">
      <div className="verified-content">
        <div className="center-content">
          <img src={ntfndIcon} alt="not-found-icon" className="sccflyIcon" />
          <h1 className="verified-text-2">
            Opps! sorry this page isn't available.
          </h1>
          <p>
            The link you followed may be broken, or the page may have been
            removed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
