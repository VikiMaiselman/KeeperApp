import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import axios from "axios";
import Header from "./Header";
import CreateArea from "./CreateArea";
import Note from "./Note";

const url = "http://localhost:3005/";

export default function App() {
  const [notes, setNotes] = useState([]);

  const getNotes = async function() {
    try {
      const {data} = await axios.get(url);
      setNotes(data);
    } catch (error) {
      console.error(error);
    }
  }

  // GET request should be executed on each rerendering
  useEffect(() => {
    getNotes();
  });

  return (
    <div>
      <Header />
      <CreateArea />
      <Grid container spacing={0} className="main">
      {notes.map((note, idx) => {
        return (
          <Grid item md={8} lg={3}>
            <Note 
                key={note._id} 
                id={note._id} 
                title={note.title} 
                contents={note.contents} />
          </Grid>
        )
      })}
      </Grid>
    </div>
  );
};