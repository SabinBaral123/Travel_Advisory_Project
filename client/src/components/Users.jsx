import { useState, useEffect } from "react";
import {
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  TextField,
  Stack,
  Button,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import * as api from "../../util/api.js";
import { blue } from "@mui/material/colors";

const Users = (props) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  // Store original user data to compare for changes
  const [originalData, setOriginalData] = useState({
    name: "",
    email: "",
  });

  // //Tracking og email for deletion
  // const [originalEmail, setOriginalEmail] = useState("");

  // Check if form has been modified
  const hasChanges = () => {
    return (
      formData.name !== originalData.name ||
      formData.email !== originalData.email
    );
  };

  // Validate form fields
  const isFormValid = () => {
    return formData.name.trim() !== "" && formData.email.trim() !== "";
  };

  const loadUsers = async () => {
    try {
      let result = await api.users.getAll();

      console.log("Loaded users:", result);
      setUsers(result);
      return result;
    } catch (error) {
      console.error("Error loading users:", error);
      props.alert("Failed to load users");
      return [];
    }
  };

  const userToMenuItem = (user, key) => (
    <MenuItem key={key} value={user.email}>
      {user.name}
    </MenuItem>
  );

  const usersMenuItems = (usersIterable) =>
    usersIterable.map((user, index) => userToMenuItem(user, index));

  const onSelectChange = (event) => {
    const userEmail = event.target.value;
    const user = users.find((u) => u.email === userEmail);

    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
    });
    // Store original data for change detection
    setOriginalData({
      name: user.name,
      email: user.email,
    });
    // // Store original email for deletion
    // setOriginalEmail(user.email);

    props.alert(`Selected ${user.name}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onDelete = async () => {
    try {
      const userToDelete = {
        ...selectedUser,
        email: originalData.email, 
      };

      let result = await api.users.delete(userToDelete);
      console.log("Delete result:", result);

      if (result.deletedCount > 0) {
        let usersWithoutDeleted = users.filter(
          (u) => u.email !== originalData.email
        );
        setUsers(usersWithoutDeleted);
        props.alert(`${selectedUser.name} deleted successfully`);
      } else {
        props.alert(`${selectedUser.name} not deleted`);
      }
    } catch (e) {
      console.warn(`Delete error:`, e);
      props.alert("Failed to delete user");
    }
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
    });
    setOriginalData({
      name: "",
      email: "",
    });
  };

  const onUpdate = async () => {
    try {
      // Validate form before submitting
      if (!isFormValid()) {
        props.alert("Please fill in all required fields");
        return;
      }

      // If no changes, don't submit
      if (!hasChanges()) {
        props.alert("No changes to update");
        return;
      }
      // Created a proper update request object
      const updateRequest = {
        filter: { email: originalData.email }, // the original email as filter
        update: {
          name: formData.name,
          email: formData.email,
        },
      };

      console.log("Sending update request:", updateRequest);

      // Send the properly structured update request
      let result = await api.users.update(updateRequest);

      console.log("Update result:", result);

      if (result.modifiedCount > 0) {
        // Update local users array
        const updatedUsers = users.map((user) => {
          if (user.email === originalData.email) {
            return {
              ...user,
              name: formData.name,
              email: formData.email,
            };
          }
          return user;
        });

        // Update the users list
        setUsers(updatedUsers);

        // Update the selected user with the new values
        setSelectedUser({
          ...selectedUser,
          name: formData.name,
          email: formData.email,
        });

        // Update original data to match the new values
        setOriginalData({
          name: formData.name,
          email: formData.email,
        });

        props.alert(`${formData.name} updated successfully`);
      } else {
        props.alert(`Failed to update ${formData.name}`);
      }
    } catch (e) {
      console.warn(`Update error:`, e);
      props.alert("Failed to update user");
    }
  };

  const onCancel = () => {
    // Clear everything if creating
    setSelectedUser(null);
    setIsCreating(false);
    setFormData({
      name: "",
      email: "",
    });
    setOriginalData({
      name: "",
      email: "",
    });
  };

  const showCreateForm = () => {
    setIsCreating(true);
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
    });
    setOriginalData({
      name: "",
      email: "",
    });
  };

  const onCreate = async () => {
    try {
      // Validate form
      if (!isFormValid()) {
        props.alert("Please fill in all required fields");
        return;
      }

      console.log("Creating user with data:", formData);

      let result = await api.users.create(formData);

      console.log("Create result:", result);

      // Check for success based on different possible API responses
      if (
        result._id ||
        result.insertedId ||
        (result.acknowledged && result.insertedId)
      ) {
        // Create a new user object with the server response data
        const newUser = {
          ...formData,
          _id: result._id || result.insertedId,
        };

        // Add the new user to the users array
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);

        // Reset form
        setIsCreating(false);

        // Set the newly created user as selected
        setSelectedUser(newUser);

        // Set original data to match the new user
        setOriginalData({
          name: formData.name,
          email: formData.email,
        });

        props.alert(`${formData.name} created successfully`);

        // Refresh the user list to ensure we have the latest data
        await loadUsers();
      } else {
        props.alert(
          `Failed to create user: ${result.message || "Unknown error"}`
        );
      }
    } catch (e) {
      console.warn(`Create error:`, e);
      props.alert(`Failed to create user: ${e.message}`);
    }
  };

  const renderUserInDetail = (user) => {
    if (!user) return <></>;

    const formHasChanges = hasChanges();
    const isValid = isFormValid();

    return (
      <>
        <CardHeader title="Details"></CardHeader>
        <CardContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            sx={{ marginBottom: "1em" }}
            error={formData.name.trim() === ""}
            helperText={formData.name.trim() === "" ? "Name is required" : ""}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={formData.email.trim() === ""}
            helperText={formData.email.trim() === "" ? "Email is required" : ""}
            required
          />
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            sx={{ marginTop: "1em" }}
          >
            <Button
              variant="contained"
              color="info"
              onClick={onUpdate}
              disabled={!formHasChanges || !isValid}
            >
              Update
            </Button>
            <Button variant="contained" color="primary" onClick={onDelete}>
              Delete
            </Button>
            <Button variant="contained" color="success" onClick={onCancel}>
              Cancel
            </Button>
          </Stack>
        </CardContent>
      </>
    );
  };

  const renderCreateForm = () => {
    const isValid = isFormValid();

    return (
      <Paper elevation={4} sx={{ marginTop: "1em" }}>
        <CardHeader title="New User"></CardHeader>
        <CardContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            sx={{ marginBottom: "1em" }}
            error={formData.name.trim() === ""}
            helperText={formData.name.trim() === "" ? "Name is required" : ""}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={formData.email.trim() === ""}
            helperText={formData.email.trim() === "" ? "Email is required" : ""}
            required
          />
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            sx={{ marginTop: "1em" }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={onCreate}
              disabled={!isValid}
            >
              CREATE
            </Button>
            <Button variant="contained" color="primary" onClick={onCancel}>
              CANCEL
            </Button>
          </Stack>
        </CardContent>
      </Paper>
    );
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
      <Paper elevation={4} sx={{ marginTop: "1em" }}>
        <CardHeader title="Users" />
        <CardContent>
          <FormControl fullWidth>
            <InputLabel>Select User</InputLabel>
            <Select
              fullWidth
              label=".................."
              defaultValue=""
              value={selectedUser ? selectedUser.email : ""}
              onChange={onSelectChange}
              disabled={isCreating}
            >
              {usersMenuItems(users)}
            </Select>
          </FormControl>
        </CardContent>
      </Paper>

      {!isCreating && selectedUser && (
        <Paper elevation={4} sx={{ marginTop: "1em" }}>
          {renderUserInDetail(selectedUser)}
        </Paper>
      )}

      {isCreating && renderCreateForm()}

      {!isCreating && !selectedUser && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={showCreateForm}
        >
          <AddIcon />
        </Fab>
      )}
    </>
  );
};

export default Users;
