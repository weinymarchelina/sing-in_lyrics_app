"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Typography, Card, Button, Icon, Box } from "@mui/material";
import Image from "next/image";
import AlbumIcon from "@mui/icons-material/Album";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

async function setCookieWithCode(token) {
  try {
    await fetch(`http://localhost:3000/api/getCookie?token=${token}`);
  } catch (error) {
    console.log("Error setting cookie: ", error);
  }
}

const LibraryCard = ({ title, icon, route }) => {
  const router = useRouter();

  return (
    <Card
      className="f-space"
      sx={{
        p: 2,
        gap: 2,
        backgroundColor: "#181818",
        color: "#eee",
        border: "1px solid #aaa",
        cursor: "pointer",
      }}
      elevation={2}
      variant="outlined"
      onClick={() => router.push(`/library/${route}`)}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, letterSpacing: ".05rem" }}
      >
        {title}
      </Typography>
      {icon}
    </Card>
  );
};

export default function Library() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      setCookieWithCode(token);
      router.push("/library");
    }
  }, [searchParams]);

  return (
    <Container
      sx={{
        p: 3,
        backgroundColor: "#202020",
        color: "#eee",
        minHeight: "100vh",
      }}
    >
      <Container sx={{ p: 0 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{ fontWeight: "800", letterSpacing: ".2rem" }}
        >
          Library
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          sx={{ mt: 3, letterSpacing: ".125rem" }}
        >
          Let's dive into your musical world ✨
        </Typography>
      </Container>

      <Container sx={{ p: 0, my: 3 }}>
        <LibraryCard
          title="Playlist"
          icon={<QueueMusicIcon fontSize="large" />}
          route="playlist"
        />
        <LibraryCard
          title="Saved Track"
          icon={<AudiotrackIcon fontSize="large" />}
          route="savedTrack"
        />
        <LibraryCard
          title="Saved Album"
          icon={<AlbumIcon fontSize="large" />}
          route="savedAlbum"
        />
      </Container>
    </Container>
  );
}
