import React, {useEffect, useRef} from "react";
import "./components/layout/Button.css";
import Home from "./pages/Home";
import {Route, Switch, useLocation} from "react-router-dom";
import {AnimatePresence, AnimateSharedLayout} from "framer-motion";
import "./App.css";
import {useStateValue} from "./StateProvider";
import LoadingBar from "react-top-loading-bar";
import {shuffleArray} from "./util";
import Fuse from "fuse.js";
import axios from "axios";

const elFonts = [
  {
    cssSrc:
      "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@800&display=swap",
  },
];

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <div className="app__inner">
        <AnimatePresence exitBeforeEnter>
          <AnimateSharedLayout>
            <Switch location={location} key={location.pathname}>
              <Route exact path="/">
                <Home />
              </Route>
            </Switch>
          </AnimateSharedLayout>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
