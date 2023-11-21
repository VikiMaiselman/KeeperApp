import React, { useState, useEffect } from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import Header from "./Header";
import MainPage from "./MainPage";
import AuthenticationPage from "./AuthenticationPage";
import Btn from "./Btn";

const url = "http://localhost:3005";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
}; 


export default function App() {
  const isUserAuthenticated = async () => {
    try {
      const response = await axios.get(`${url}/isAuthenticated`, { withCredentials: true }, headers);
      setIsAuthenticated(response.data);
      await getNotes();
    } catch (error) {
      console.error(error);
    }
  }

  const getNotes = async function() {
    try {
      const data = await axios.get(url, { withCredentials: true }, headers);
      const userNotes = data.data.notes;
      setNotes(userNotes);
    } catch (error) {
      console.error(error);
    }
  }

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const initializeApp = async () => {
      await isUserAuthenticated();
    };

    initializeApp();
  }, []); // Empty dependency array ensures this runs once on mount

  const logOut = async () => {
    const response = await axios.get(`${url}/logout`, { withCredentials: true }, headers);
    setIsAuthenticated(response.data.isAuthenticated);
  }

  return (
    <div>
      <Header />
      {isAuthenticated ? 
      ( <div className="content">
          <MainPage notes={notes} getNotes={getNotes}/>
          <Btn text="Log Out" onClick={logOut} icon={<LogoutIcon />}/>
        </div>) : 
      ( <AuthenticationPage 
          authorize={setIsAuthenticated}
          setNotes={setNotes}
        />)
      }
    </div>
  );
};