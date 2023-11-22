
import React from 'react';
import GroupForm from "./components/groupForm";
import Usercontrol from "./components/userlogincomponent";
import MovieListComponent from "./components/MovieListComponent";
import ReviewsComponent from "./components/reviewsComponent";
import MyPage from './components/mypagecomponent';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { jwtToken, userData } from "./components/Signals";
import Testi from './components/testi';



function Home() {
  return <h1>Hello World!</h1>;
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/user-control">Login / Register</Link>
            </li>
            <li>
              <Link to="/movie-list">Movie / Series List</Link>
            </li>
            <li>
              <Link to="/reviews">Reviews</Link>
            </li>
            <li>
              <Link to="/group-form">Groups</Link>
            </li>
            {jwtToken.value ? (
            <li>
                <Link to={`/mypage/${userData.value?.private}`}>{`${userData.value?.private}'s MyPage`}</Link>
            </li> ) : null}
          </ul>
        </nav>

        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route path="/user-control" element={<Usercontrol/>} />
          <Route path="/group-form" element={<GroupForm/>} />
          <Route path="/movie-list" element={<MovieListComponent/>} />
          <Route path="/reviews" element={<ReviewsComponent/>} />
          <Route path="/mypage/:username" element={<MyPage />} />
          <Route path="/testi/:id" element={<Testi />} /> {/*Testi esimerkki poistan myöhemmin -roope */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;