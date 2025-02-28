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
  Fab
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Users = (props) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [formMode, setFormMode] = useState("view"); // "view", "edit", "create"
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const loadUsers = async () => {
    try {
      
      let response = await fetch(`http://localhost:9000/api/users`);
      let result = await response.json();
      console.log("Loaded users:", result);
      setUsers(result);
    
      // Simple count based on the length of the users array
      const userCount = result.length || 0;
      props.alert(`Loaded ${userCount} users`);
      return result;
    } catch (error) {
      console.error("Error loading users:", error);
      props.alert("Failed to load users");
      return [];
    }
  };

  const userToMenuItem = (user, key) => (
    <MenuItem key={key} value={user}>
      {user.name}
    </MenuItem>
  );

  const usersMenuItems = (usersIterable) =>
    usersIterable.map((user, index) => userToMenuItem(user, index));

  const onSelectChange = (event) => {
    let user = event.target.value;
    console.log(user);
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email
    });
    setFormMode("view");
    props.alert(`Selected ${user.name}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const onDelete = async () => {
    try {
      let response = await fetch(`http://localhost:9000/api/users/${selectedUser.email}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json', // Fixed content type
          'Content-Type': 'application/json'
        }
      });
      let result = await response.json();
      console.log("Delete result:", result);

      if (result.deletedCount > 0) {
        let usersWithoutDeleted = users.filter(u => u.email !== selectedUser.email);
        setUsers(usersWithoutDeleted);
        props.alert(`${selectedUser.name} deleted successfully`);
      } else {
        props.alert(`${selectedUser.name} not deleted`);
      }
    }
    catch (e) {
      console.warn(`Delete error:`, e);
      props.alert('Failed to delete user');
    }
    setSelectedUser(null);
    setFormMode("view");
  };

  const onUpdate = async () => {
    try {
      if (formMode === "view") {
        // Switch to edit mode
        setFormMode("edit");
        return;
      }

      // Submit the update
      let response = await fetch(`http://localhost:9000/api/users/${selectedUser.email}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json', // Fixed content type
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      let result = await response.json();
      console.log("Update result:", result);

      if (result.modifiedCount > 0) {
        // Update local users array
        const updatedUsers = users.map(user => {
          if (user.email === selectedUser.email) {
            return { ...formData };
          }
          return user;
        });
        setUsers(updatedUsers);
        props.alert(`${formData.name} updated successfully`);
      } else {
        props.alert(`Failed to update ${formData.name}`);
      }
      
      // Reset selection and mode
      setSelectedUser(null);
      setFormMode("view");
    }
    catch (e) {
      console.warn(`Update error:`, e);
      props.alert('Failed to update user');
    }
  };

  const onCancel = () => {
    setSelectedUser(null);
    setFormMode("view");
    setIsCreating(false);
    setFormData({
      name: "",
      email: ""
    });
  };

  const showCreateForm = () => {
    setIsCreating(true);
    setSelectedUser(null);
    setFormMode("create");
    setFormData({
      name: "",
      email: ""
    });
  };

  const onCreate = async () => {
    try {
      // Validate form data
      if (!formData.name || !formData.email) {
        props.alert("Name and email are required");
        return;
      }
      
      console.log("Creating user with data:", formData);
      
      let response = await fetch(`http://localhost:9000/api/users`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json', // Fixed content type
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      // Check if the response is ok before parsing
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let result = await response.json();
      console.log("Create result:", result);

      // Check for success based on different possible API responses
      if (result._id || result.insertedId || (result.acknowledged && result.insertedId)) {
        // Create a new user object with the server response data
        const newUser = { 
          ...formData, 
          _id: result._id || result.insertedId 
        };
        
        // Add the new user to the users array
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        
        props.alert(`${formData.name} created successfully`);
        
        // Reset form
        setIsCreating(false);
        setFormMode("view");
        setFormData({
          name: "",
          email: ""
        });
        
        // Refresh the user list to ensure we have the latest data
        await loadUsers();
      } else {
        props.alert(`Failed to create user: ${result.message || "Unknown error"}`);
      }
    }
    catch (e) {
      console.warn(`Create error:`, e);
      props.alert(`Failed to create user: ${e.message}`);
    }
  };

  const renderUserInDetail = (user) => {
    if (!user) return <></>;
    
    const isEditMode = formMode === "edit";
    
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
            disabled={!isEditMode}
            sx={{ marginBottom: "1em" }}
          />
          <TextField 
            fullWidth 
            label="Email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditMode}
          />
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ marginTop: "1em" }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onUpdate}
            >
              {isEditMode ? "Update" : "Edit"}
            </Button>
            <Button variant="contained" color="error" onClick={onDelete}>Delete</Button>
            <Button variant="contained" onClick={onCancel}>Cancel</Button>
          </Stack>
        </CardContent>
      </>
    );
  };

  const renderCreateForm = () => {
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
            required
          />
          <TextField 
            fullWidth 
            label="Email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ marginTop: "1em" }}>
            <Button 
              variant="contained" 
              color="success" 
              onClick={onCreate}
            >
              CREATE
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onCancel}
            >
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
              value={selectedUser ?? ""}
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
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={showCreateForm}
        >
          <AddIcon />
        </Fab>
      )}
    </>
  );
};

export default Users;
