import React from 'react';
import { useParams } from 'react-router-dom';
//import axios from 'axios';
//import { jwtToken, userData } from "./Signals";

function MyPage() {
    let { username } = useParams();
  
    return <h1>{`${username}'s MyPage`}</h1>;
  }

export default MyPage;