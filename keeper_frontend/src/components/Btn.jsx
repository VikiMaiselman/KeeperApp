import React from "react";
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      ochre: {
        main: '#CD9701',
        contrastText: '#ffffff'
      },
      yellow: {
        main: '#f5ba13',
        contrastText: '#ffffff'
      }
    },
  });

  
export default function Btn({text, onClick, icon}) {
    const color = text === 'Log Out' ? 'ochre' : 'yellow';
    
    return (
        <ThemeProvider theme={theme}>
            <Button variant="contained" color={color} className="logoutBtn" endIcon={icon} onClick={onClick}>
                {text}
            </Button>
        </ThemeProvider>    
    );
}