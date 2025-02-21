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
} from "@mui/material";

import "../App.css";
import { useState } from "react";

const Home = () => {
  const [userInput, setUserInput] = useState("");

  const findAlert = () => {
    alert(`This will be a call to /api/users/:${userInput}`);
  };
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
            onClick={findAlert}
          >
            FIND
          </Button>
        </CardContent>
      </Paper>
    </>
  );
};
export default Home;
