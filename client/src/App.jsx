import { useState } from "react";
import { Snackbar } from "@mui/material";

import "./App.css";

import Home from "./components/Home.jsx";
// New import
import Header from "./components/Header.jsx";
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
      {/* Passing alert={alert} function through the prop */}
      <Header alert={alert} />
      <Home alert={alert} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        // Clear the snackbar state on close
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </>
  );
}

export default App;
