"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconButton,
  ButtonGroup,
  Typography,
  Button,
  Box,
  Icon,
  Container,
  BottomNavigation,
  Card,
  AppBar,
  Paper,
  CardContent,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";

async function getCurrentTrack() {
  try {
    const res = await fetch("http://localhost:3000/api/getCurrentTrack", {
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error getting track:", error);
    return null;
  }
}

async function handlePlayback(action) {
  try {
    const url = `http://localhost:3000/api/${action}Track`;
    const res = await fetch(url, {
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.log(`Error doing ${action} action:`, error);
  }
}

export default function PlayerBar() {
  const [track, setTrack] = useState(null);
  const [nextTrack, setNextTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const fetchCurrentTrack = async () => {
    const data = await getCurrentTrack();

    if (data?.redirect_user) {
      router.push("/");
    }

    if (data) {
      setTrack(data.current_track);
      setNextTrack(data.next_track);
      setIsPlaying(data.current_track?.is_playing);
    }
    console.log(data);
  };

  useEffect(() => {
    fetchCurrentTrack();
  }, [pathname]);

  const handlePlayPauseToggle = async () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    const data = await handlePlayback(isPlaying ? "pause" : "play");

    if (data) {
      setTrack(data.current_track);
      setNextTrack(data.next_track);
      console.log(data);
    }
  };

  const handleSkipTrack = async (action) => {
    const data = await handlePlayback(action);

    if (data) {
      setTrack(data.current_track);
      setNextTrack(data.next_track);
      console.log(data);
    }
  };

  return (
    <Container sx={{ position: "fixed", bottom: 0, left: 0, right: 0, px: 0 }}>
      {track && (
        <>
          <Card elevation={3}>
            <Container
              sx={{
                p: 1,
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Box sx={{ minWidth: "4rem" }}>
                <Image
                  src={track.album_img[2].url}
                  alt={`${track.album_name}_img`}
                  width={track.album_img[2].width}
                  height={track.album_img[2].height}
                />
              </Box>
              <Box sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                <Typography noWrap>{track.name}</Typography>
                <Typography noWrap>
                  {track.artists.map((artist) => artist.name).join(", ")}
                </Typography>
              </Box>
            </Container>

            <Container className="f-row" sx={{ gap: 2 }}>
              <IconButton onClick={() => handleSkipTrack("previous")}>
                <SkipPreviousIcon fontSize="large" />
              </IconButton>
              <IconButton size="large" onClick={handlePlayPauseToggle}>
                {isPlaying ? (
                  <PauseCircleIcon fontSize="large" />
                ) : (
                  <PlayCircleIcon fontSize="large" />
                )}
              </IconButton>
              <IconButton onClick={() => handleSkipTrack("next")}>
                <SkipNextIcon fontSize="large" />
              </IconButton>
            </Container>

            {nextTrack && (
              <Container
                sx={{
                  p: 2,
                  borderTop: "1px solid #eee",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Typography noWrap>
                  <Link href={`/lyric/${nextTrack.id}`}>{`Next : ${
                    nextTrack.name
                  } • ${nextTrack.artists
                    .map((artist) => artist.name)
                    .join(", ")}`}</Link>
                </Typography>
              </Container>
            )}
          </Card>
          <Navbar trackId={track.id} />
        </>
      )}
    </Container>
  );
}
