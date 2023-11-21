import React from "react";
import { Grid } from "@mui/material";
import CreateArea from "./CreateArea";
import Note from "./Note";

export default function MainPage({notes, getNotes}) {
    return (
        <div className="notesContainer">
            <CreateArea getNotes={getNotes}/>
            <Grid container spacing={0} className="main">
                {notes.map((note) => {
                    return (
                        <Grid item md={8} lg={3}>
                            <Note 
                                key={note._id} 
                                id={note._id} 
                                title={note.title} 
                                contents={note.contents}
                                getNotes={getNotes}
                            />
                        </Grid>
                    )
                })}
            </Grid>
        </div>
    );
}