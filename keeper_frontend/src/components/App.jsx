import React, { useEffect, useState } from "react";
import axios from "axios";
import Note from "./Note";
import CreateArea from "./CreateArea";

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
      <CreateArea />
      {notes.map((note, idx) => {
        return <Note key={note._id} id={note._id} title={note.title} contents={note.contents} />
      })}
    </div>
  );
};