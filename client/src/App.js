import Usercontrol from "./components/userlogincomponent";
import MovieListComponent from "./components/MovieListComponent";
import SeriesCard from "./components/SeriesCardComponent";
function App() {
  return (
    <div >
      <h1> Hello World!</h1>
      <Usercontrol/>
      <MovieListComponent/>{/*Movie list component*/}
    </div>
  );
}

export default App;