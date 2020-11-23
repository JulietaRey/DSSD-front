import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import ProjectConfig from "./pages/ProjectConfig";

import './App.scss';
import SignIn from "./pages/SignIn";
import { UseSession } from "./context/Session";

function App() {
  return (
    <div className="root">
      <UseSession>
        <Router>
          <Switch>
            <Route path="/project/config" component={ProjectConfig} />
            <Route path="/signin" component={SignIn} />
            <Route path="/" component={Home} />

          </Switch>
        </Router>
      </UseSession>
    </div>


  );
}

export default App;
