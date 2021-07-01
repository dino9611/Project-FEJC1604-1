import React from "react";
import Loader from "react-loader-spinner";
import './styles/loader.css'

function LoaderComp() {
  return (
    <div className="loading-admin">
      <Loader
        type="TailSpin"
        color="#052C43"
        height={100}
        width={100}
        timeout={7000}
      />
    </div>
  );
}

export default LoaderComp;
