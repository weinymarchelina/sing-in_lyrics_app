"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import PlaylistList from "../../../components/PlaylistList";
import { Box, IconButton, Container, Typography, Card } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

async function getPlaylist(page = 0) {
  try {
    const url = `http://localhost:3000/api/getPlaylist${
      page ? `?page=${page}` : ""
    }`;
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

export default function Playlist() {
  const [currentPage, setCurrentPage] = useState(1);
  const [playlists, setPlaylists] = useState([]);
  const [isNextPage, setIsNextPage] = useState(false);
  const smallScreen = useMediaQuery("(max-width:720px)");

  const fetchData = async () => {
    const newData = await getPlaylist(currentPage);
    console.log(newData?.playlist_list);
    setPlaylists(newData?.playlist_list || []);
    setIsNextPage(newData?.is_next_page || false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <Container
      className={smallScreen ? "" : "f-row"}
      sx={{
        p: 3,
        pb: 30,
        minHeight: "100vh",
        backgroundColor: "#202020",
        color: "#eee",
      }}
    >
      <Box className="f-col" sx={{ width: "100%" }} maxWidth={"lg"}>
        <Typography variant="h2" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
          Playlist
        </Typography>

        {playlists.length > 0 && (
          <Container className="f-col" sx={{ px: 0 }}>
            <Container
              className="f-space"
              sx={{ gap: 2, px: 0, alignItems: "flex-end" }}
            >
              <Typography
                variant="h6"
                component="p"
                sx={{ textTransform: "uppercase" }}
              >{`Page ${currentPage}`}</Typography>
              <Card
                variant="outlined"
                sx={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
              >
                {currentPage > 1 && (
                  <IconButton onClick={handlePreviousPage}>
                    <ArrowBackIosIcon color="secondary" />
                  </IconButton>
                )}
                {isNextPage && (
                  <IconButton onClick={handleNextPage}>
                    <ArrowForwardIosIcon color="secondary" />
                  </IconButton>
                )}
              </Card>
            </Container>
            <PlaylistList playlists={playlists} />
          </Container>
        )}
      </Box>
    </Container>
  );
}
