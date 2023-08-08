"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography } from "@mui/material";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push("/library");
      router.refresh();
    }, 3000);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [router]);

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
      <Typography variant="h3" component="p">
        404 - Page Not Found
      </Typography>
      <Typography variant="h5" component="p" sx={{ py: 2 }}>
        Redirecting you to the main page...
      </Typography>
    </Container>
  );
}
