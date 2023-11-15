import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtToken, userData } from "./Signals";

function Login() {

  return (
    <div>
      <UserInfo/>
      { jwtToken.value.length === 0 ? <LoginForm/> : 
        <button onClick={() => jwtToken.value = ''}>Logout</button>}
    </div>
  );
}

function UserInfo(){

  return(
    <div>
      {jwtToken.value ? <h1>{userData.value?.private}</h1> : <h1>You are guest</h1>}
    </div>
  )
}

function LoginForm(){

  const [username, setUname] = useState('');
  const [password, setPw] = useState('');

  function login(){
    console.log(username + " "+password)
    axios.post('http://localhost:3001/user/', {username,password})
      .then(resp => jwtToken.value = resp.data.jwtToken )
      .catch(error => console.log(error.response.data))
  }

  return(
    <div>
      <input value={username} onChange={e => setUname(e.target.value)}/>
      <input type= "password" value={password} onChange={e => setPw(e.target.value)}/>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;