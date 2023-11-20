import Usercontrol from "./components/userlogincomponent";
import MovieListComponent from "./components/MovieListComponent";

function App() {
  return (
    <div >
      <h1> Hello World!</h1>
      <Usercontrol />{/*login/register component */}
      <MovieListComponent/>{/*Movie list component*/}
    </div>
  );
}

export default App;
