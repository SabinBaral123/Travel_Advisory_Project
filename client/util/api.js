const API_PORT = 9000; // Only needed for local development. In AWS we'll host the API on 80/443

// Resolves to either "" or "localhost:9000"
const server = (endpoint) => {
    // Relative paths (i.e. not starting with http://...) resolve to the current IP:PORT
    let serverUrl = "";

    const { hostname } = window.location; // Read the current window URL hostname
    if (hostname == "localhost" || hostname == "127.0.0.1") { // If it's locally hosted
        // Then we want to use an absolte path http://localhost:9000
        serverUrl = `http://localhost:${API_PORT}`;
    }

    return `${serverUrl}${endpoint}`; // Build the rest of the url
}
const get = async (url, responseFormat = "json") => {
    let response = await fetch(url);
    let result = await response[responseFormat](); // "dynamic" function call
    return result;
}

const users = {
    getAll: () => get(server("/api/users")) // matchs the API routing in the server
}

export {
    get,
    users
}