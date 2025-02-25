import { useState, useEffect } from "react";
import {
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
const Users = (props) => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    let response = await fetch(`http://localhost:9000/api/users`);
    let result = await response.json();
    console.log(result);
    setUsers(result);
    return users;
  };
  // Select - State
  const [selectedUser, setSelectedUser] = useState("");

  // Select - Dynamic Rendering
  // These are a traditional one-line functional component. Data goes in => component goes out.
  // They could each be their own Component files using props as arguments
  const userToMenuItem = (user, key) => (
    <MenuItem key={key} value={user}>
      {user.name}
    </MenuItem>
  ); // key required - remove and see warning
  const usersMenuItems = (usersIterable) =>
    usersIterable.map((user, index) => userToMenuItem(user, index));

  // Select - "Event Emitter"
  // How do you even figure out that it's even.target.value?
  // Documentation, experience, or console.log and tears
  const onSelectChange = (event) => {
    let user = event.target.value;
    console.log(user);
    setSelectedUser(user);
    props.alert(`Selected ${user.name}`);
  };

  // Runs once per rendering
  useEffect(() => {
    loadUsers();
  }, []);
  return (
    <>
      <Paper elevation={4} sx={{ marginTop: "1em" }}>
        <CardHeader title="Users" />
        <CardContent>
          {/* Just for the Select label to work. Remove it and you'll understand */}
          <FormControl fullWidth>
            {/* This will render */}
            <InputLabel>Select User</InputLabel>

            {/* This label doesn't render, but "sets up space" */}
            {/* Try "Select User", 11 spaces, and 11 dots */}
            <Select
              fullWidth
              label=".................."
              defaultValue=""
              value={selectedUser ?? ""}
              onChange={onSelectChange}
            >
              {/* Remove this and we don't have the user's names as options */}
              {usersMenuItems(users)}
            </Select>
          </FormControl>
        </CardContent>
      </Paper>
    </>
  );
};
export default Users;
