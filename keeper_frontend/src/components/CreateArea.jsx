import React, { useState } from "react";
import Button from '@mui/material/Button';
import axios from "axios";

const url = "http://localhost:3005";

export default function CreateArea() {
  const [note, setNote] = useState({
    title: "",
    contents: ""
  });
  const [toSendRequest, setToSendRequest] = useState(false);

  const handleInputChange = (event) => {
    const {name, value} = event.target;
    const updateNote = (prevState) => {
        return {...prevState, [name] : value}
    }
    setNote(updateNote);
  }

  // here no need to use useEffect(), createNote called on btn click
  const createNote = async function (toSend) {
    if (!toSendRequest) return;
    
    try {
      const headers = {
        headers: {
          'content-type': 'application/json'
        }
      };
      await axios.post(url, note, headers);
    } catch (error) {
      console.error(error)
    }

    // state updater function form to ensure the latest state is used
    setToSendRequest((prevState) => !prevState);
    setNote({ title: "", contents: "" });
  }

  return (
    <form>
        <input onChange={handleInputChange} name="title" value={note.title}/>
        <input onChange={handleInputChange} name="contents" value={note.contents}/>
        <Button onClick={
          (event) => {
            setToSendRequest((prevState) => !prevState);
            createNote(true);
            event.preventDefault();
          } 
        }>Add</Button>
    </form>
  );
}
