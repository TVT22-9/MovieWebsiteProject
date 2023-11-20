import Usercontrol from "./components/userlogincomponent";
import MovieListComponent from "./components/MovieListComponent";
import ReviewsComponent from "./components/reviewsComponent";

function App() {
  return (
    <div >
      <h1> Hello World!</h1>
      <Usercontrol/>
      <MovieListComponent/>{/*Movie list component*/}
      <ReviewsComponent/>
    </div>
  );
}

export default App;
