import TestComponent from "./components/DELETEMEtestcomponent";
import MovieListComponent from "./components/MovieListComponent";
import ApiTestComponent from "./components/apiTestComponent";

function App() {
  return (
    <div >
      <h1> Hello World!</h1>
      <TestComponent/> {/*TestComponent will be deleted later, it just shows is the database connection working*/}
      <MovieListComponent/>{/*TestComponent will be deleted later, it just shows is the database connection working*/}
    </div>
  );
}

export default App;
