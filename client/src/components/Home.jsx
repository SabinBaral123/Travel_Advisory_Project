import { useState, useEffect } from "react";
import {
  Paper,
  CardHeader,
  CardContent,
  Autocomplete,
  Box,
  TextField,
  Divider,
  Typography,
  Fab,
} from "@mui/material";
import * as api from "../../util/api.js";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import logo from "../assets/alert_logo2.webp";

const Home = (props) => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  const loadAlerts = async () => {
    let result = await api.alerts.getSearchData();
    setAlerts(result);
    props.alert(`${result.length} alerts loaded`);
  };

  // Load all bookmarks to check against
  const loadBookmarks = async () => {
    try {
      const result = await api.bookmarks.getBookmark();
      setBookmarks(result);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  };

  // A simple transformation arrow function to "stringify" our alert
  const alertAsText = (alert) =>
    `(${alert.country_code}) ${alert.country_name}`;

  const renderAutocompleteOption = (props, option) => {
    const { key, ...nonKeyProps } = props;

    return (
      <Box key={key} {...nonKeyProps}>
        <>{alertAsText(option)}</>
      </Box>
    );
  };

  // Check if alert is already bookmarked
  const checkIfBookmarked = (alert) => {
    if (!alert) return false;
    return bookmarks.some(bookmark => bookmark.country_code === alert.country_code);
  };

  // Handling onChange event
  const fetchAlert = async (alert) => {
    if (!alert) {
      setSelectedAlert(null);
      setIsBookmarked(false);
      return;
    }

    try {
      // Fetch the alert details
      let alertData = await api.alerts.getDetails(alert.country_code);

      // Check if the response is valid
      if (!alertData || typeof alertData !== "object") {
        throw new Error("Invalid JSON response");
      }

      // Update state
      setSelectedAlert(alertData);
      
      // Check if this alert is already bookmarked
      const bookmarked = checkIfBookmarked(alertData);
      setIsBookmarked(bookmarked);
      
      props.alert(`Retrieved alert for ${alert.country_name}`);
    } catch (error) {
      console.error("Error fetching alert:", error);
      props.alert("Error fetching alert data");
    }
  };

  // Conditionally rendering the full Alert data
  const renderAlert = (alert) => {
    if (!alert) return <></>;

    return (
      <Paper elevation={4} sx={{ marginTop: "0.5em" }}>
        <CardContent sx={{ marginTop: "0.5em" }}>
          <Typography variant="h5">{alertAsText(alert)}</Typography>
          <Typography variant="h6" sx={{ mt: "0.5em" }}>
            {alert.sub_region}
          </Typography>
          <Divider sx={{ mt: "1em", mb: "1em" }} />
          {alert.advisory ? (
            <>
              <Typography variant="subtitle1">{alert.advisory}</Typography>
              <Divider sx={{ mt: "1em", mb: "1em" }} />
              <Typography variant="subtitle1">{alert.date}</Typography>
            </>
          ) : (
            <Typography variant="subtitle1">No Advisory Provided</Typography>
          )}
        </CardContent>
      </Paper>
    );
  };

  // Toggle bookmark (add or remove)
  const toggleBookmark = async () => {
    if (!selectedAlert) return;

    try {
      if (isBookmarked) {
        // Remove bookmark
        await api.bookmarks.deleteBookmark(selectedAlert.country_code);
        props.alert(`${selectedAlert.country_name} bookmark removed`);
      } else {
        // Add bookmark
        await api.bookmarks.createBookmark(selectedAlert);
        props.alert(`${selectedAlert.country_name} bookmarked`);
      }
      
      // Toggle state
      setIsBookmarked(!isBookmarked);
      
      // Refresh bookmarks list
      loadBookmarks();
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      props.alert("Failed to update bookmark");
    }
  };

  useEffect(() => {
    loadAlerts();
    loadBookmarks();
  }, []);

  // Check bookmark state when selected alert changes
  useEffect(() => {
    if (selectedAlert) {
      setIsBookmarked(checkIfBookmarked(selectedAlert));
    } else {
      setIsBookmarked(false);
    }
  }, [selectedAlert, bookmarks]);

  return (
    <>
      <Paper elevation={4} sx={{ marginTop: "1em" }}>
        <CardHeader title="Travel Alerts" />
        <CardContent>
          <img style={{ width: "40%", maxWidth: "200px" }} src={logo} alt="Travel Alert Logo" />

          <Autocomplete
            options={alerts}
            autoHighlight
            getOptionKey={(option) => option.country_code}
            getOptionLabel={(option) => alertAsText(option)}
            renderOption={renderAutocompleteOption}
            renderInput={(params) => (
              <TextField {...params} label="Find Alert" />
            )}
            sx={{ marginTop: "0.5em" }}
            onChange={(_event, selectedOption) => fetchAlert(selectedOption)}
          />
        </CardContent>
      </Paper>
      {renderAlert(selectedAlert)}
      {selectedAlert && (
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            zIndex: 1000,
          }}
          onClick={toggleBookmark}
        >
          {isBookmarked ? (
            <BookmarkIcon sx={{ color: "white" }} />
          ) : (
            <BookmarkBorderIcon />
          )}
        </Fab>
      )}
    </>
  );
};

export default Home;