import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import Home from "./pages/Home";
import ProjectConfig from "./pages/ProjectConfig";

import './App.scss';
import SignIn from "./pages/SignIn";
import { UseSession } from "./context/Session";

function App() {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
    </MuiPickersUtilsProvider>


  );
}

export default App;
