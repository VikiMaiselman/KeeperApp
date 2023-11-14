import React, {useState} from "react";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from "axios";

const url = "http://localhost:3005";

export default function Note(props) {
  const [note, setNote] = useState({
    title: props.title,
    contents: props.contents, 
    id: props.id, 
  });
    
  const handleInputChange = (event) => {
    const {name, value} = event.target;
    const updateNote = (prevState) => {
      return {...prevState, [name] : value}
    }
    setNote(updateNote);
  }

  const deleteNote = async ()  => {
    try {
      await axios.delete(`${url}/delete/${note.id}`);
    } catch (error) {
      console.error(error);
    }
  }

  const handlePressingEnter = async (event) => {
    if (event.key !== 'Enter') return;

    try {
      await axios.put(`${url}/update/${note.id}`, note);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Paper className="note">

        <input className="note-input title" onKeyDown={handlePressingEnter} onChange={handleInputChange} name="title" value={note.title}/>
        <input className="note-input contents" onKeyDown={handlePressingEnter} onChange={handleInputChange} name="contents" value={note.contents}/>
        <Button onClick={(event) => {
            deleteNote();
            event.preventDefault();
        }}>
        Delete
        </Button>

    </Paper>
  );
}
