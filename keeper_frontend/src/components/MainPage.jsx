import React from "react";
import { Grid } from "@mui/material";
import CreateArea from "./CreateArea";
import Note from "./Note";

// import axios from "axios";
// const url = "http://localhost:3005/logout";

// const logOut = async () => {
//     try {
//         await axios.get(url)
//     } catch (error) {
//         console.error(error);
//     }
// }

export default function MainPage({notes, currentUser}) {
    return (
        <div>
            <CreateArea curUser={currentUser}/>
            <Grid container spacing={0} className="main">
                {notes.map((note, idx) => {
                    return (
                        <Grid item md={8} lg={3}>
                            <Note 
                                key={note._id} 
                                id={note._id} 
                                title={note.title} 
                                contents={note.contents}
                                curUser={currentUser}
                            />
                        </Grid>
                    )
                })}
            </Grid>
            {/* <button onClick={logOut}>Log Out</button> */}
        </div>
    );
}