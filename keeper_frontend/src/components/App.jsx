import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import MainPage from "./MainPage";
import AuthenticationPage from "./AuthenticationPage";

const url = "http://localhost:3005";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [notes, setNotes] = useState([]);

  const getNotes = async function() {
    try {
      const {data} = await axios.get(`${url}/${currentUser}`, { withCredentials: true });
      const userNotes = data[0].notes;

      setNotes(userNotes);
    } catch (error) {
      console.error(error);
    }
  }

  // GET request should be executed on each render (no 2nd param specified)
  useEffect(() => {
    getNotes();
  });

  const logOut = () => {
    setIsAuthenticated(false);
  }

  return (
    <div>
      <Header />
      {isAuthenticated ? 
      (<div>
          <MainPage notes={notes} currentUser={currentUser}/>
          <button onClick={logOut}>
            Log Out
          </button>
       </div>) : 
      ( <AuthenticationPage 
          authorize={setIsAuthenticated}
          setUser={setCurrentUser}
        />)
      }

    </div>
  );
};