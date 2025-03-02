import { useState } from "react";
import { Snackbar } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import * as api from "../util/api.js";

import Home from "./components/Home.jsx";
import Header from "./components/Header.jsx";
import Users from "./components/Users.jsx";
import Bookmark from "./components/Bookmark.jsx";
import { createTheme, ThemeProvider } from "@mui/material";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
      primary: {
          main: red[800] 
      }
  }
});
function App() {
  // Alert function
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });
  // Anyone with a reference to this function can call this to create a snackbar alert
  const alert = (message) => {
    setSnackbar({
      open: true,
      message,
    });
  };
  return (
    <>
    <ThemeProvider theme={theme}>
      {/* BrowserRouter controls the routing logic */}
      <BrowserRouter>
        {/* Passing alert={alert} function through the prop */}
        <Header alert={alert} />

        {/* Route elements can only be added inside of a Routes element */}
        <Routes>
          {/* if we go to http://localhost:5173 it's implicitly http://localhost:5173/ and we go here */}
          <Route path="/" element={<Home alert={alert} />} />
          {/* if we go to http://localhost:5173/users we go here */}
          <Route path="/users" element={<Users alert={alert}></Users>} />{" "}
          <Route path="/bookmarks" element={<Bookmark alert={alert} />} /> 

        </Routes>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          // Clear the snackbar state on close
          onClose={() => setSnackbar({ open: false, message: "" })}
          message={snackbar.message}
        />
      </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
