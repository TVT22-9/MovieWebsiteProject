
import React from 'react';
import GroupForm from "./components/groupForm";
import Usercontrol from "./components/userlogincomponent";
import MovieListComponent from "./components/MovieListComponent";
import ReviewsComponent from "./components/reviewsComponent";


function App() {
  return (
    <div>
      <h1> Hello World!</h1>

      <GroupForm />

      <Usercontrol/>
      <MovieListComponent/>{/*Movie list component*/}
      <ReviewsComponent/>

    </div>
  );
}

export default App;