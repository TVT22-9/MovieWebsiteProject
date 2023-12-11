import React from 'react';
import GroupForm from "./components/groupForm";
import GroupProfileComponent from './components/GroupProfileComponent';
import Usercontrol from "./components/userlogincomponent";
import MovieListComponent from "./components/MovieListComponent";
import ReviewsComponent from "./components/reviewsComponent";
import MyPage from './components/mypagecomponent';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { jwtToken, userData } from "./components/Signals";
import MoviePageComponent from './components/MoviePageComponent';
import SeriesPageComponent from './components/SeriesPageComponent';
import NewsSearchComponent from './components/NewsSearchComponent'
import "./globalMyPageLogin.css";
import './moviePageCss.css';
import MovieCard from './components/MovieCardComponent'




function Home() {
  return (
    <body>
      <h1>Welcome to our movie website project</h1>
      <p>Here you can browse both movies and series, and if you register and login you can review them!</p>
      <p>There also is option to browse Finnkino news and set up your ownpage or group page!</p>
      <MiniComponentMovie />
    </body>
  )
}

function App() {
  return (
    <Router>
      <div className='app'>
        <nav className='nav'>
          <ul>
            {jwtToken.value ? (
              <li>
                <Link to={`/mypage/${userData.value?.private}`}>{`${userData.value?.private}'s MyPage`}</Link>
              </li>) :
              <li>
                <Link to="/">Home</Link>
              </li>}

            {jwtToken.value ? (
              <li>
                <Link to="/user-control">Logout</Link>
              </li>) : <li>
              <Link to="/user-control">Login / Register</Link>
            </li>}
            <li>
              <Link to="/movie-list">Movie / Series List</Link>
            </li>
            <li>
              <Link to="/reviews">Reviews</Link>
            </li>
            <li>
              <Link to="/group-form">Groups</Link>
            </li>
            <li>
              <Link to="/news">News</Link>
            </li>
          </ul>
        </nav>


        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/user-control" element={<Usercontrol />} />
          <Route path="/group-form" element={<GroupForm />} />
          <Route path="/group/:groupId" element={<GroupProfileComponent />} />
          <Route path="/movie-list" element={<MovieListComponent />} />
          <Route path="/reviews" element={<ReviewsComponent />} />
          <Route path="/mypage/:username" element={<MyPage />} />
          <Route path="/movie/:id" element={<MoviePageComponent />} />
          <Route path="/series/:id" element={<SeriesPageComponent />} />
          <Route path="/news" element={<NewsSearchComponent />} />

        </Routes>
        <footer className='footerclass'>
          <h2>This site wouldn't work without</h2>
          <img src="/Moviedb.svg" alt="Footer Image" />
        </footer>
      </div>
    </Router>
  );
}

function MiniComponentMovie() {
  let greatest = 12;
  return (
    <div>
      <h2>Greatest movie of the millenia</h2>
      {
        <MovieCard id={greatest} />
      }
    </div>
  );
}

export default App;