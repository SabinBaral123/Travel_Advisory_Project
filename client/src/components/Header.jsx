import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import * as api from "../../util/api.js";

const Header = (props) => {
  const [menuAnchorElement, setMenuAnchorElement] = useState(null);
  const navigate = useNavigate();

  const refreshDatabase = async () => {
    try {
      const response = await api.util.refreshDatabase();
     

      if (!response.ok) {
        throw new Error("Failed to refresh database");
      }

      if (props.alert) {
        props.alert("Database refreshed successfully!");
      }
    } catch (error) {
      console.error("Error refreshing database:", error);
      if (props.alert) {
        props.alert("Failed to refresh database.");
      }
    } finally {
      setMenuAnchorElement(null); // Close menu
    }
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">INFO-3139 - Project 1</Typography>
          <IconButton
            color="inherit"
            onClick={(e) => setMenuAnchorElement(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={menuAnchorElement}
        open={Boolean(menuAnchorElement)}
        onClose={() => setMenuAnchorElement(null)}
      >
       <MenuItem onClick={() => { navigate("/"); setMenuAnchorElement(null); }}>Home</MenuItem>
        <MenuItem onClick={refreshDatabase}>Refresh Database</MenuItem>
        <MenuItem onClick={() => { navigate("/users"); setMenuAnchorElement(null); }}>Users</MenuItem>
      </Menu>
    </>
  );
};
export default Header;
