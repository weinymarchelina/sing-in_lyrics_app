"use client";
import { useEffect, useState } from "react";
import BottomNavbar from "./BottomNavbar";
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
    const res = await fetch("/api/getCurrentTrack", {
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error getting track:", error);
    return null;
  }
}

async function handlePlayback(action) {
  try {
    const url = `/api/${action}Track`;
    const res = await fetch(url, {
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error(`Error doing ${action} action:`, error);
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
    }
  };

  const handleSkipTrack = async (action) => {
    const data = await handlePlayback(action);

    if (data) {
      setTrack(data.current_track);
      setNextTrack(data.next_track);
      setIsPlaying(true);
    }
  };

  const handleClickLyric = (event) => {
    event.stopPropagation();
    router.push(`/lyric/current`);
  };

  const smallScreenStyle = {
    py: 0,
    gap: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const largeScreenStyle = {
    py: 1,
  };

  const smallScreenAccordionSumContent = track && (
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
          src={track.album_img[0].url}
          alt={`${track.album_name}_img`}
          width={track.album_img[2].width}
          height={track.album_img[2].height}
        />
      </Box>
      <Box sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        <Typography variant="h6" component="p" onClick={handleClickLyric}>
          {track.name}
        </Typography>
        <Typography onClick={handleClickLyric}>
          {track.artists.map((artist) => artist.name).join(", ")}
        </Typography>
      </Box>
    </Container>
  );

  const largeScreenAccordionSumContent = track && (
    <>
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
            src={track.album_img[1].url}
            alt={`${track.album_name}_img`}
            width={50}
            height={50}
          />
        </Box>
        <Box
          sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          onClick={handleClickLyric}
        >
          <Typography variant={smallScreen ? "h6" : "p"} component="p">
            {track.name}
          </Typography>
          <Typography variant={smallScreen ? "p" : "caption"} component="p">
            {track.artists.map((artist) => artist.name).join(", ")}
          </Typography>
        </Box>
      </Container>
      <Container
        sx={{
          flex: 1,
          p: 0,
          gap: `${smallScreen ? 3 : 5}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
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
                textDecoration: `${smallScreen ? "none" : "underline"}`,
                textUnderlineOffset: `${smallScreen ? "5px" : "1px"}`,
              }}
            >
              <Link href={`/lyric/${nextTrack.id}?status=next`}>{`Next : ${
                nextTrack.name
              } • ${nextTrack.artists
                .map((artist) => artist.name)
                .join(", ")}`}</Link>
            </Typography>
          </Container>
        )}
      </Container>
    </>
  );

  const accordionTemplate = (accordionSumContent) => {
    return (
      <Accordion
        elevation={smallScreen ? 2 : 0}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          color: "#eee",
          py: `${smallScreen ? 0 : 1}`,
        }}
        style={{ margin: 0 }}
      >
        <AccordionSummary
          sx={smallScreen ? smallScreenStyle : largeScreenStyle}
          expandIcon={<ExpandMoreIcon color="secondary" />}
        >
          {accordionSumContent}
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          <Container
            sx={{
              gap: 2,
              borderTop: `${smallScreen ? "1px solid #aaa" : "none"}`,
              maxHeight: `${smallScreen ? "none" : "7vh"}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
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
          {smallScreen && nextTrack && (
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
                <Link href={`/lyric/${nextTrack.id}?status=next`}>{`Next : ${
                  nextTrack.name
                } • ${nextTrack.artists
                  .map((artist) => artist.name)
                  .join(", ")}`}</Link>
              </Typography>
            </Container>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Container sx={{ position: "fixed", bottom: 0, left: 0, right: 0, px: 0 }}>
      {track && (
        <>
          {smallScreen && accordionTemplate(smallScreenAccordionSumContent)}
          {!smallScreen && accordionTemplate(largeScreenAccordionSumContent)}
        </>
      )}

      {smallScreen && (
        <Container sx={{ position: "relative", minHeight: "4.25rem" }}>
          <BottomNavbar />
        </Container>
      )}
    </Container>
  );
}
