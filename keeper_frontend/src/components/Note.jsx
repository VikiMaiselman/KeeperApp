import React, {useState} from "react";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from "axios";

const url = "http://localhost:3005";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
}; 

export default function Note(props) {
  const [note, setNote] = useState({
    title: props.title,
    contents: props.contents, 
    id: props.id, 
  });
    
  const handleInputChange = (event) => {
    const {name, value} = event.target;
    const updateNote = (prevState) => {
      return {...prevState, [name]: value}
    }
    setNote(updateNote);
  }

  const deleteNote = async ()  => {
    try {
      await axios.delete(`${url}/delete/${note.id}`, { withCredentials: true }, headers);
      await props.getNotes();
    } catch (error) {
      console.error(error);
    }
  }

  const handlePressingEnter = async (event) => {
    if (event.key !== 'Enter') return;

    event.target.blur();
    try {
      await axios.put(`${url}/update/${note.id}`, note, { withCredentials: true}, headers);
      await props.getNotes();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Paper className="note" elevation={2} sx={{backgroundColor: "#FFF9F0"}}>
        <textarea className="note-input title" onKeyDown={handlePressingEnter} onChange={handleInputChange} name="title" value={note.title}/>
        <textarea className="note-input" onKeyDown={handlePressingEnter} onChange={handleInputChange} name="contents" value={note.contents} rows={3}/>
        <Button onClick={(event) => {
            deleteNote();
            event.preventDefault();
        }}>
          <DeleteForeverIcon fontSize="large" sx={{color: "#4E4637", position: "relative", left: "42.5%"}}/>
        </Button>

    </Paper>
  );
}
