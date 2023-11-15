import { Typography } from "@mui/material";
import React from "react";

export default function Header() {
  return (
    <Typography variant="h4" className="header" sx={{fontFamily: "monospace", fontWeight: 'bold'}}>
      Keeper App (inspired by Google)
    </Typography>
  );
};