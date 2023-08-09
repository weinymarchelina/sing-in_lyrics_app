"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, Typography, Button } from "@mui/material";
import Image from "next/image";
const baseUrl = process.env.BASE_URL;

async function checkAuth() {
  try {
    const res = await fetch(`/api/checkToken`);

    const data = res.json();

    return data;
  } catch (error) {
    console.log("Error setting cookie: ", error);
  }
}

async function clearCookies() {
  try {
    await fetch(`/api/logout`);
  } catch (error) {
    console.log("Error setting cookie: ", error);
  }
}

export default async function Home() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const data = await checkAuth();

      if (data?.is_auth) {
        router.push("/library");
      } else {
        await clearCookies();
      }
    };

    handleAuth();
  }, []);

  return (
    <Container
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
      <Container className="f-col" maxWidth={"xs"}>
        <Container className="f-col">
          <img src="/base_brand.png" alt="singin_icon" />
        </Container>
        <Container>
          <Typography
            component="h2"
            sx={{ py: 2, lineHeight: "155%", fontSize: "1.15rem" }}
          >
            Elevate Your Music Experience with Lyric Books
          </Typography>
        </Container>
        <Container
          className="f-row"
          sx={{ py: 3, textAlign: "center", maxWidth: "225px" }}
        >
          <img src="/user_music.svg" alt="singin_icon" />
        </Container>

        <Container className="f-row" sx={{ py: 1 }} maxWidth={"xs"}>
          <Button
            onClick={() => router.push("/api")}
            className="f-row"
            color="secondary"
            variant="contained"
            sx={{ width: "100%", gap: 1 }}
          >
            <Typography variant="h6" component="p" sx={{ fontWeight: 600 }}>
              Login
            </Typography>
            <Box className="f-col">
              <Image
                src="/icon.svg"
                alt="spotify_icon"
                width={35}
                height={35}
              />
            </Box>
          </Button>
        </Container>
      </Container>
    </Container>
  );
}
