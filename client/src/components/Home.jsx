import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Paper,
  Snackbar,
} from "@mui/material";

import "../App.css";
import { useState } from "react";



const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const findAlert = () => {
    alert(`This will be a call to /api/users/:${userInput}`);
  };
  const findName = async email => {
    let message = 'No results found';
    try {
        let response = await fetch(`http://localhost:9000/api/users?email=${email}`);
        let result = await response.json();
        console.log(result);
        if (result.length > 1) {
            message = `${result.length} users found`;
        }
        else if (result.length > 0) {
            message = `User ${result[0].name} found`;
        }
    }
    catch (e) {
        console.warn(`${e}`);
        message = `Search failed`;
    }

    setSnackbarOpen(true);
    setSnackbarText(message);
}
  return (
    <>
      <AppBar position = "sticky">
        <Toolbar>
          <Typography variant="h6">INFO-3139 - Project 1</Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={4} sx={{marginTop:"1em"}}>
        <CardHeader title="Find Name By Email" />
        <CardContent>
          <TextField
            fullWidth
            className="textField"
            label="User Email"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button
          fullWidth
            variant="contained"
            className="buttonFind"
            sx={{ marginTop: "2em" }}
            onClick={() => findName(userInput)}          >
            FIND
          </Button>
        </CardContent>
      </Paper>
      <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarText}
        />
    </>
  );
};
export default Home;
