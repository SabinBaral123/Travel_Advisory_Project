import { useState, useEffect } from "react";
import { CardHeader, Paper, CardContent, Typography, Divider, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import * as api from "../../util/api.js";

const Bookmark = (props) => {
  const [bookmarks, setBookmarks] = useState([]);

  const loadBookmarks = async () => {
    try {
      let result = await api.bookmarks.getBookmark();
      setBookmarks(result);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      props.alert("Failed to load bookmarks");
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleDelete = async (country_code) => {
    try {
      await api.bookmarks.deleteBookmark(country_code);
      props.alert(`${bookmark.country_name} deleted`);
      // Refresh the bookmarks list
      loadBookmarks();
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      props.alert("Failed to delete bookmark");
    }
  };

  const renderBookmark = (bookmark) => {
    return (
      <CardContent sx={{ marginTop: "0.5em", position: "relative" }}>
        <IconButton 
          color="error"
          sx={{ position: "absolute", top: "10px", right: "10px" }}
          onClick={() => handleDelete(bookmark.country_code)}
        >
          <DeleteIcon />
        </IconButton>

        <Typography variant="h5">{`(${bookmark.country_code}) ${bookmark.country_name}`}</Typography>
        <Typography variant="h6" sx={{ mt: "0.5em" }}>
          {bookmark.sub_region}
        </Typography>
        <Divider sx={{ mt: "1em", mb: "1em" }} />
        {bookmark.advisory ? (
          <>
            <Typography variant="subtitle1">{bookmark.advisory}</Typography>
            <Divider sx={{ mt: "1em", mb: "1em" }} />
            <Typography variant="subtitle1">{bookmark.date}</Typography>
          </>
        ) : (
          <Typography variant="subtitle1">No Advisory Provided</Typography>
        )}
      </CardContent>
    );
  };
 
  return (
    <>
      <Paper elevation={4} sx={{ marginTop: "0.5em" }}>
        <CardHeader title="Bookmarks" />
      </Paper>
      {bookmarks.length === 0 ? (
        <Typography sx={{ mt: "1em" }}>No bookmarks available.</Typography>
      ) : (
        bookmarks.map((bookmark) => (
          <Paper 
            key={ bookmark.country_code} 
            elevation={4} 
            sx={{ marginTop: "0.5em" }}
          >
            {renderBookmark(bookmark)}
          </Paper>
        ))
      )}
    </>
  );
};
export default Bookmark;
