import React from "react";

function Alert(props) {
  const capatalize = (word) => {
    if(word === "danger"){
      word = "error"
    }
    const lowre = word.toLowerCase();
    return lowre.charAt(0).toUpperCase() + lowre.slice(1);   
  };
  return (
    <div style={{ height: "50px" }}>
      {props.alert && (
        <div
          className={`alert alert-${props.alert.type} alert-dismissible fade show`}
          role="alert"
        >
          <strong>{capatalize(props.alert.type)}</strong> : {props.alert.msg}
        </div>
      )}
    </div>
  );
}

export default Alert;
