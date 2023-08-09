"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Button, Box } from "@mui/material";
import Image from "next/image";

async function checkAuth() {
  try {
    const res = await fetch("/api/checkToken");
    const data = res.json();
    return data;
  } catch (error) {
    console.log("Error checking authentication: ", error);
  }
}

async function clearCookies() {
  try {
    await fetch("/api/logout");
  } catch (error) {
    console.log("Error clearing cookies: ", error);
  }
}

function Home() {
  const router = useRouter();

  const handleAuth = async () => {
    const data = await checkAuth();

    if (data?.is_auth) {
      router.push("/library");
    } else {
      await clearCookies();
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  return (
    <Container
      sx={{
        p: 3,
        backgroundColor: "#202020",
        color: "#eee",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Container maxWidth="xs" className="f-col">
        <Container className="f-col">
          <img src="/base_brand.png" alt="signin_icon" />
        </Container>
        <Container>
          <Typography
            component="h2"
            sx={{ py: 2, lineHeight: "155%", fontSize: "1.15rem" }}
          >
            Elevate Your Music Experience with Lyric Books
          </Typography>
        </Container>
        <Container className="f-row" sx={{ py: 3, maxWidth: "225px" }}>
          <img src="/user_music.svg" alt="signin_icon" />
        </Container>
        <Container className="f-row" sx={{ py: 1 }} maxWidth="xs">
          <Button
            onClick={() => router.push("/api")}
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

export default Home;
