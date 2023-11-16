import React, { useState } from 'react';
import axios from 'axios';
import { jwtToken, userData } from "./Signals";
//primary component that renders both login and reqister components if the sessions storage doesn't have a jwttoken yet
//if the token is found it instead renders just a greetings text containing the username and a logout button that resets the jwttoken back to none
//jwttoken is a signal so whenever it gets updated it automatically renders the components that utilize it
function Usercontrol() {
  if (jwtToken.value.length === 0) {
    return (
      <div>
        <UserInfo />
        <h2> Sign in</h2>
        <SignInForm />
        <h2>Don't have an account? Create one Below!</h2>
        <RegisterForm/>
      </div>
    );
  } else {
    return (
      <div>
        <UserInfo />
        <button onClick={() => (jwtToken.value = '')}>Logout</button>
      </div>
    );
  }
}
//Modified code from teaching example, if jwt token has a value it renders a message containing welcome and the private value that is currently just the username
//if there is no jwttoken it instead renders a guest user message
function UserInfo(){

  return(
    <div>
      {jwtToken.value ? <h1>{"Welcome " + userData.value?.private}</h1> : <h2>You are currently guest </h2> }
    </div>
  )
}


//singinform is a component containing the essential login component that allows the existing user to login and get a jwt token
function SignInForm(){

  const [username, setUname] = useState('');
  const [password, setPw] = useState('');
  const [signInStatus, setSignInStatus] = useState(null);
  

  function signIn(){
    //if either of the inputed data is empty it doesn't do a database query but sets the singinstauts state to empty so a error message can be rendered later
    if (!username.trim() || !password.trim()) {
      console.log('Username and password are required.');
      setSignInStatus('empty');
      return;
    } else { 
    axios.post('http://localhost:3001/user/', {username,password})
      .then(resp => jwtToken.value = resp.data.jwtToken )
      .catch(error => { 
        console.log(error.response.data)
        setSignInStatus('error') 
      })
    }
  }
//the rendered part contains two input boxes and a button that calls the function above, it also has conditional messages that are used if error happens
  return(
    <div>
      <input placeholder="Username" type= "text" value={username} onChange={e => setUname(e.target.value)}/>
      <input placeholder="Password"  type= "password" value={password} onChange={e => setPw(e.target.value)}/>
      <button onClick={signIn}>Sign in</button>
      {signInStatus === 'error' && <p>Either username or password is wrong</p>}
      {signInStatus === 'empty' && <p>Please give both username and password.</p>}
    </div>
  );
}
//Reqister form is very similiar to the singin one but contains more robust error handling becouse here it's more important that the user knows what they may be doing wrong
function RegisterForm() {
  const [username, setUname] = useState('');
  const [password, setPw] = useState('');
  const userSettings = { settingsdata: 1 };
  const [registrationStatus, setRegistrationStatus] = useState(null);

 

  function register() {

    if (!username.trim() || !password.trim()) {
      console.log('Username and password are required.');
      setRegistrationStatus('empty');
      return;
    } else{
    axios.post('http://localhost:3001/user/register', { username, password, settingsjson: JSON.stringify(userSettings) })
      .then(resp => {
        console.log(resp.data);
        setRegistrationStatus('success');
        setUname("");
        setPw("");
      })
      .catch(error => {
        console.error(error);
  
        if (error.response?.status === 500) {
          console.log('Duplicate key violation or bad data detected');
          setRegistrationStatus('duplicate');
        } else {
          console.log('Other error detected');
          setRegistrationStatus('failure');
        }
      });
    }
  }

  return (
    <div>
      <input placeholder="Username" type= "text" value={username} onChange={e => setUname(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPw(e.target.value)} />
      <button onClick={register}>register</button>
      {registrationStatus === 'success' && <p>Registration successful!, you may now login</p>}
      {registrationStatus === 'duplicate' && <p>Username already exists or is too long. Please choose a different one.</p>}
      {registrationStatus === 'failure' && <p>Registration failed. Please try again.</p>}
      {registrationStatus === 'empty' && <p>Please give both username and password.</p>}
    </div>
  );
}

export default Usercontrol;