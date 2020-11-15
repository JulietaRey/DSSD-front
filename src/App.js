import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import ProjectConfig from "./pages/ProjectConfig";

import './App.scss';
import SignIn from "./pages/SignIn";

function App() {
  return (
    <div className="root">
      <Router>
        <Switch>
          <Route path="/project/config" component={ProjectConfig} />
          <Route path="/signin" component={SignIn} />
          <Route path="/" component={Home} />

        </Switch>
      </Router>
    </div>


  );
}

export default App;
