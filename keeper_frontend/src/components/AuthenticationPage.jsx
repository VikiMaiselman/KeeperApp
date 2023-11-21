import React, { useState } from "react";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import { Typography } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Btn from "./Btn";
import axios from "axios";

const url = "http://localhost:3005";

export default function AuthenticationPage({authorize, setNotes}) {
    const [userData, setUserData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (event) => {
        const {name, value} = event.target;

        const updateUserData = (prevState) => ({...prevState, [name]: value});
        setUserData(updateUserData);
    }

    const handleSignUp = async () => {
        try {
            const headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000",
           }; 

            const response = await axios.post(`${url}/register`, userData, { withCredentials: true}, headers);
            authorize(response.data.isAuthenticated);
            setNotes(response.data.notes)
        } catch (error) {
            alert(error.response.data.errorMsg);
            console.error(error.response);
        }
    }

    const handleLogIn = async () => {
        try {
            const headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000",
           }; 
           
            const response = await axios.post(`${url}/login`, userData, { withCredentials: true}, headers);
            authorize(response.data.isAuthenticated);
            setNotes(response.data.notes)
        } catch (error) {
            alert("Login failed. Check wether your username and/or password are correct.");
            console.error(error.message);
        }
    }

    return (
        <div className="autorization">
            <Typography variant="h4" sx={{color: "#f5ba13;"}}>LOG IN / SIGN UP</Typography>
            <div className="authForm">
            <FormControl>
                <InputLabel htmlFor="username">Email address</InputLabel>
                <Input id="username" name="username" onChange={handleChange} value={userData.email} placeholder="Enter your e-mail..."/>
            </FormControl>   
            <FormControl>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input id="password" type="password" name="password" onChange={handleChange} value={userData.password} placeholder="Enter your password"/>
            </FormControl>
            </div>
            <div class="buttons">
                <Btn text="Log In" onClick={handleLogIn} icon={<LoginIcon />}/>
                <Btn text="Sign Up" onClick={handleSignUp} icon={<PersonAddIcon />} />
            </div>
        </div>
    );
}