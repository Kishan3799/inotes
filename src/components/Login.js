import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const {email, password} = credentials
  let navigete = useNavigate();// it is replace history with useNavigate in react router dom

  const handleOnSubmit = async (e) => {
    e.preventDefault(); // it is used for not reloading page
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password}),
    });
    const json = await response.json();
    console.log(json);

    if(json.success){
        //save the auth token and redirect
        localStorage.setItem('token', json.authtoken)
        props.showAlert("Login Successfully", "success")
        navigete('/')  
    }
    else {
      props.showAlert("Inavalid Detatils! Please enter a valid details", "danger");
    }
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            value={email}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
