import React, { useState } from "react";
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from "axios";
import { Paper } from "@mui/material";

const url = "http://localhost:3005";

export default function CreateArea({getNotes}) {
  const [note, setNote] = useState({
    title: "",
    contents: "",
  });
  const [toSendRequest, setToSendRequest] = useState(false);

  const handleInputChange = (event) => {
    const {name, value} = event.target;
    const updateNote = (prevState) => {
        return {...prevState, [name]: value}
    }
    setNote(updateNote);
  }

  // here no need to use useEffect(), createNote called on btn click
  const createNote = async function () {
    if (!toSendRequest) return;
    
    try {
      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
      }; 
      await axios.post(url, note, { withCredentials: true}, headers);
      await getNotes();
    } catch (error) {
      console.error(error)
    }

    // state updater function form to ensure the latest state is used
    setToSendRequest((prevState) => !prevState);
    setNote({ title: "", contents: "" });
  }

  return (
    <Paper className="createArea" elevation={4} sx={{backgroundColor: "#CD9700"}}>
      <form>
          <textarea className="note-input" onChange={handleInputChange} name="title" value={note.title} placeholder="Title"/>
          <textarea className="note-input" onChange={handleInputChange} name="contents" value={note.contents} placeholder="Note Text"/>
          <Button onClick={
            (event) => {
              setToSendRequest((prevState) => !prevState);
              createNote();
              event.preventDefault();
            } 
          }>
            <AddCircleOutlineIcon fontSize="large" style={{color: "#FFF9F0"}}/>
          </Button>
      </form>
    </Paper>
  );
}
