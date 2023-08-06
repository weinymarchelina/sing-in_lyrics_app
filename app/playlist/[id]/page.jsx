"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import TrackList from "../../../components/TrackList";
import {
  useRouter,
  useParams,
  useSearchParams,
  usePathname,
} from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import { Box, Container, Card, IconButton, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

async function getPlaylistTrack(playlistId, page = 1) {
  try {
    const url = `http://localhost:3000/api/playlist/${playlistId}?page=${page}`;
    console.log(url);
    const res = await fetch(url, {
      next: {
        revalidate: 5,
      },
    });

    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

export default function PlaylistTrack() {
  const [playlist, setPlaylist] = useState({});
  const router = useRouter();
  const pathname = usePathname();
  const playlistId = useParams().id;
  const page = useSearchParams().get("page");
  const currentPage = page ? parseInt(page) : 1;
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const smallScreen = useMediaQuery("(max-width:720px)");

  const fetchData = async () => {
    const newData = await getPlaylistTrack(playlistId, currentPage);
    setPlaylist(newData || {});
    console.log(newData);
    setBgColor(newData?.bg_color || "");
    setTextColor(newData?.text_color || "");
  };

  useEffect(() => {
    fetchData();
  }, [playlistId, page]);

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    router.push(`${pathname}?page=${nextPage}`);
  };

  const handlePreviousPage = () => {
    const prevPage = Math.max(currentPage - 1, 1);
    router.push(`${pathname}?page=${prevPage}`);
  };

  return (
    <Container
      className={smallScreen ? "" : "f-row"}
      sx={{
        p: 3,
        pb: 30,
        backgroundColor: bgColor,
        color: textColor,
        minHeight: "100vh",
      }}
    >
      <Box sx={{ p: 0 }} maxWidth={"lg"}>
        {playlist.name && (
          <Container sx={{ py: 2 }}>
            {playlist?.img && playlist?.img[0]?.url && (
              <Box
                sx={{
                  minWidth: 250,
                  boxShadow: "0px 0px 1rem 1rem rgba(0,0,0,0.12)",
                }}
              >
                <Image
                  src={playlist.img[0].url}
                  alt={`${playlist.name}_img`}
                  width={300}
                  height={300}
                />
              </Box>
            )}
            <Container sx={{ pt: 3, px: 0 }}>
              <Typography variant="h3" component="h1">
                {playlist.name}
              </Typography>
              {playlist.total_tracks && (
                <Typography
                  sx={{ py: 2, textTransform: "uppercase" }}
                  variant="h6"
                  component="h2"
                >
                  {playlist.total_tracks} tracks
                </Typography>
              )}
            </Container>
            <Container
              className="f-space"
              sx={{ px: 0, py: 2, alignItems: "center" }}
            >
              <Typography
                variant="h6"
                component="p"
                sx={{ textTransform: "uppercase" }}
              >{`Page ${currentPage}`}</Typography>
              <Card
                variant="outlined"
                sx={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
              >
                {page > 1 && (
                  <IconButton onClick={handlePreviousPage}>
                    <ArrowBackIosIcon sx={{ color: textColor }} />
                  </IconButton>
                )}
                {playlist?.is_next_page && (
                  <IconButton onClick={handleNextPage}>
                    <ArrowForwardIosIcon sx={{ color: textColor }} />
                  </IconButton>
                )}
              </Card>
            </Container>
          </Container>
        )}
        {playlist?.track_list?.length > 0 && (
          <Container sx={{ my: 5, px: 0 }}>
            <Typography variant="h5" sx={{ textTransform: "uppercase" }}>
              All tracks
            </Typography>
            <TrackList tracks={playlist.track_list} textColor={textColor} />
          </Container>
        )}
      </Box>
    </Container>
  );
}
