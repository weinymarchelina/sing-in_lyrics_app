"use client";
import { Container, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Container
      className="f-col"
      sx={{
        p: 3,
        backgroundColor: "#202020",
        color: "#eee",
        minHeight: "100vh",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container sx={{ width: "300px" }} maxWidth="sm" className="f-col">
        <img src="/base_brand.png" alt="singin_icon" />
      </Container>
      <Typography variant="h4" component="p" sx={{ py: 5 }}>
        Loading...
      </Typography>
    </Container>
  );
}
