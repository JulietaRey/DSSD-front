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
import SignUp from "./pages/SignUp";
import { UseSession } from "./context/Session";
import Header from "./components/Header";
import { Container, createMuiTheme, ThemeProvider } from "@material-ui/core";
import Monitor from "./pages/Monitor";

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Poppins',
  },
  palette: {
    primary: {
      main: '#ec407a',
    },
    secondary: {
      main: '#00838f',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="root">
          <UseSession>
            <Router>
            <Header />
            <Container style={{
              marginTop: '80px',
              display: 'flex',
              justifyContent: 'center'
            }}>

              <Switch>
                <Route path="/project/config" component={ProjectConfig} />
                <Route path="/signin" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <Route path="/monitoreo" component={Monitor} />
                <Route exact path="/" component={Home} />

              </Switch>
            </Container>
            </Router>
          </UseSession>
        </div>
      </MuiPickersUtilsProvider>
    </ThemeProvider>


  );
}

export default App;
