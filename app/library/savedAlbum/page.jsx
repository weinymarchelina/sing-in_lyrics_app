"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import AlbumList from "../../../components/AlbumList";
import { IconButton, Container, Typography, Card } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

async function getSavedAlbum(page = 0) {
  try {
    const url = `http://localhost:3000/api/getSavedAlbum${
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

export default function SavedAlbum() {
  const [currentPage, setCurrentPage] = useState(1);
  const [albums, setAlbums] = useState([]);
  const [isNextPage, setIsNextPage] = useState(false);

  // Function to fetch data for the current page
  const fetchData = async () => {
    const newData = await getSavedAlbum(currentPage);
    setAlbums(newData?.album_data || []);
    setIsNextPage(newData?.is_next_page || false);
    console.log(newData?.album_data);
  };

  // Fetch data when the component mounts or when the currentPage changes
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // Function to handle the "Next Page" button click
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Function to handle the "Previous Page" button click
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <Container sx={{ p: 3 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 3 }}>
        Saved Albums
      </Typography>

      {albums.length > 0 && (
        <Container className="f-col" sx={{ px: 0 }}>
          <Container
            className="f-space"
            sx={{ gap: 2, px: 0, alignItems: "center" }}
          >
            <Typography
              variant="h6"
              sx={{ textTransform: "uppercase" }}
            >{`Page ${currentPage}`}</Typography>
            <Card variant="outlined">
              {currentPage > 1 && (
                <IconButton onClick={handlePreviousPage}>
                  <ArrowBackIosIcon />
                </IconButton>
              )}
              {isNextPage && (
                <IconButton onClick={handleNextPage}>
                  <ArrowForwardIosIcon />
                </IconButton>
              )}
            </Card>
          </Container>
          <AlbumList albums={albums} />
        </Container>
      )}
    </Container>
  );
}
