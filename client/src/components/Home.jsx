import { useState } from "react";
import {
   
    Paper,
    CardHeader,
    CardContent,
    TextField,
    Snackbar,
    Button,
    
} from "@mui/material";
import * as api from "../../util/api.js";

const Home = (props) => {

    const [inputText, setInputText] = useState('');


    const findName = async email => {
        try {
           // let response = await fetch(`http://localhost:9000/api/users?email=${email}`);
            let result = await api.users.getquery({email:inputText})
            console.log(result);
            if (result.length > 1) {
                 props.alert (`${result.length} users found`);
            }
            else if (result.length > 0) {
                props.alert(`User ${result[0].name} found`);
            }
        }
        catch (e) {
            console.warn(`${e}`);
            props.alert(`Search failed`);
        }

        
    }
    

    return (<>
        
        <Paper elevation={4} sx={{ marginTop: "1em" }}>
            <CardHeader title="Find Name By Email" />
            <CardContent>
            <TextField fullWidth label="User Email"
                    // Reading inputText from state
                    value={inputText}
                    // Updating state with a new object with { field: value }
                        onChange={e => setInputText(e.target.value)}

                    sx={{ marginBottom: "1em" }}
                />
                <Button fullWidth variant="contained"
                    onClick={() => {
                        // Reading inputText from state
                        findName(inputText);
                    }}
                >FIND</Button>
                
            </CardContent>
        </Paper>
       
    </>);
};
export default Home;