"use client";
import { useEffect, useState } from "react";
import BottomNavbar from "../components/BottomNavbar";
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
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

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

  const smallScreen = useMediaQuery("(max-width:720px)");

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

  const handleClickLyric = (event) => {
    event.stopPropagation();
    router.push(`/lyric/${track.id}`);
  };

  return (
    <Container sx={{ position: "fixed", bottom: 0, left: 0, right: 0, px: 0 }}>
      {track && (
        <>
          {smallScreen && (
            <Accordion
              elevation={2}
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.85)", color: "#eee" }}
              style={{ margin: 0 }}
            >
              <AccordionSummary
                sx={{ py: 1 }}
                expandIcon={<ExpandMoreIcon color="secondary" />}
              >
                <Container
                  sx={{
                    p: 0,
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
                    <Typography variant="h6" component="p">
                      {track.name}
                    </Typography>
                    <Typography>
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </Typography>
                  </Box>
                </Container>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 0 }}>
                <Container
                  className="f-row"
                  sx={{ gap: 2, borderTop: "1px solid #aaa" }}
                >
                  <IconButton onClick={() => handleSkipTrack("previous")}>
                    <SkipPreviousIcon fontSize="large" color="secondary" />
                  </IconButton>
                  <IconButton size="large" onClick={handlePlayPauseToggle}>
                    {isPlaying ? (
                      <PauseCircleIcon fontSize="large" color="secondary" />
                    ) : (
                      <PlayCircleIcon fontSize="large" color="secondary" />
                    )}
                  </IconButton>
                  <IconButton onClick={() => handleSkipTrack("next")}>
                    <SkipNextIcon fontSize="large" color="secondary" />
                  </IconButton>
                </Container>
                {nextTrack && (
                  <Container
                    sx={{
                      p: 2,
                      borderTop: "1px solid #aaa",
                      borderBottom: "1px solid #aaa",
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
              </AccordionDetails>
            </Accordion>
          )}
          {!smallScreen && (
            <Accordion
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                color: "#eee",
                py: 1,
              }}
              style={{ margin: 0 }}
            >
              <AccordionSummary
                className="f-row"
                sx={{ py: 0, gap: 2 }}
                expandIcon={<ExpandMoreIcon color="secondary" />}
              >
                <Container
                  sx={{
                    px: 0,
                    py: `${smallScreen ? 2 : 0}`,
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    flex: 5,
                  }}
                >
                  <Box sx={{ minWidth: "50px" }}>
                    <Image
                      src={track.album_img[2].url}
                      alt={`${track.album_name}_img`}
                      width={50}
                      height={50}
                    />
                  </Box>
                  <Box sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    <Typography
                      variant={smallScreen ? "h6" : "p"}
                      component="p"
                    >
                      {track.name}
                    </Typography>
                    <Typography
                      variant={smallScreen ? "p" : "caption"}
                      component="p"
                    >
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </Typography>
                  </Box>
                </Container>
                <Container
                  className="f-row"
                  sx={{ flex: 1, p: 0, gap: `${smallScreen ? 3 : 5}` }}
                >
                  <IconButton sx={{ flex: 1 }} onClick={handleClickLyric}>
                    <LibraryMusicIcon color="secondary" />
                  </IconButton>
                  {nextTrack && (
                    <Container
                      sx={{
                        px: `${smallScreen ? 2 : 1}`,
                        py: 2,

                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "calc(30vw + 3rem)",
                      }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Typography
                        variant={smallScreen ? "p" : "caption"}
                        component="p"
                        noWrap
                        sx={{
                          textDecoration: `${
                            smallScreen ? "none" : "underline"
                          }`,
                          textUnderlineOffset: `${smallScreen ? "5px" : "1px"}`,
                        }}
                      >
                        <Link href={`/lyric/${nextTrack.id}`}>{`Next : ${
                          nextTrack.name
                        } • ${nextTrack.artists
                          .map((artist) => artist.name)
                          .join(", ")}`}</Link>
                      </Typography>
                    </Container>
                  )}
                </Container>
              </AccordionSummary>
              <AccordionDetails
                className="f-row"
                sx={{ gap: 2, maxHeight: "7vh" }}
              >
                <IconButton onClick={() => handleSkipTrack("previous")}>
                  <SkipPreviousIcon fontSize="large" color="secondary" />
                </IconButton>
                <IconButton size="large" onClick={handlePlayPauseToggle}>
                  {isPlaying ? (
                    <PauseCircleIcon fontSize="large" color="secondary" />
                  ) : (
                    <PlayCircleIcon fontSize="large" color="secondary" />
                  )}
                </IconButton>
                <IconButton onClick={() => handleSkipTrack("next")}>
                  <SkipNextIcon fontSize="large" color="secondary" />
                </IconButton>
              </AccordionDetails>
            </Accordion>
          )}
        </>
      )}

      {smallScreen && (
        <Container sx={{ position: "relative", minHeight: "4.25rem" }}>
          <BottomNavbar trackId={track?.id} />
        </Container>
      )}
    </Container>
  );
}
