import React, { useState } from "react";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { Typography } from "@mui/material";
import axios from "axios";

const url = "http://localhost:3005";

export default function AuthenticationPage({authorize, setUser}) {
    const [userData, setUserData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (event) => {
        const {name, value} = event.target;

        const updateUserData = (prevState) => ({...prevState, [name]: value});
        setUserData(updateUserData);
    }

    const handleSignUp = async (event) => {
        try {
            const headers = {
              headers: {' content-type': 'application/json', withCredentials: true }
            };

            const response = await axios.post(`${url}/register`, userData, headers);
            authorize(response.data.isAuthenticated);
            setUser(response.data.user._id);
        } catch (error) {
            console.error( error.response);
        }
    }

    const handleLogIn = async () => {
        try {
            const headers = {
              headers: { 'content-type': 'application/json', withCredentials: true  }
            };

            const response = await axios.post(`${url}/login`, userData, headers);
            authorize(response.data.isAuthenticated);
            setUser(response.data.user._id);
        } catch (error) {
            console.error( error.response);
        }
    }

    return (
        <div className="autorization">
            <Typography variant="h4">LOGIN HERE</Typography>
            <div className="authForm">
            <FormControl>
                <label htmlFor="username">Email address</label>
                <Input id="username" name="username" onChange={handleChange} value={userData.email} placeholder="Enter your e-mail..."/>
            </FormControl>   
            <FormControl>
                <label htmlFor="password">Password</label>
                <Input id="password" name="password" onChange={handleChange} value={userData.password} placeholder="Enter your password"/>
                <div>
                    <Button onClick={handleLogIn}>Log In</Button>
                    <Button onClick={handleSignUp}>Sign Up</Button>
                </div>
            </FormControl>
            </div>
        </div>
    );
}