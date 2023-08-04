"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Box, Typography, Card } from "@mui/material";
import Link from "next/link";
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
    <Container sx={{ p: 3 }}>
      <Container sx={{ p: 0 }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: "800" }}>
          Library
        </Typography>

        <Typography variant="h5" component="h2" sx={{ mt: 3 }}>
          Good afternoon!
        </Typography>
      </Container>

      <Container sx={{ p: 0, my: 3 }}>
        <Card
          className="f-space"
          sx={{ p: 2, gap: 2 }}
          elevation={2}
          variant="outlined"
          onClick={() => router.push("/library/playlist")}
        >
          <Typography variant="h5">Playlist</Typography>
          <QueueMusicIcon fontSize="large" />
        </Card>

        <Card
          className="f-space"
          sx={{ p: 2, gap: 2 }}
          elevation={2}
          variant="outlined"
          onClick={() => router.push("/library/savedTrack")}
        >
          <Typography variant="h5">Saved Track</Typography>
          <AudiotrackIcon fontSize="large" />
        </Card>

        <Card
          className="f-space"
          sx={{ p: 2, gap: 2 }}
          elevation={2}
          variant="outlined"
          onClick={() => router.push("/library/savedAlbum")}
        >
          <Typography variant="h5">Saved Album</Typography>
          <AlbumIcon fontSize="large" />
        </Card>
      </Container>
    </Container>
  );
}
