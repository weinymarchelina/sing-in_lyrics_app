"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import TrackList from "../../../components/TrackList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconButton, Container, Typography, Card } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

async function getSavedTrack(page = 1) {
  try {
    const url = `http://localhost:3000/api/getSavedTrack${
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

export default function SavedTrack() {
  const [tracks, setTracks] = useState([]);
  const [isNextPage, setIsNextPage] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const page = useSearchParams().get("page");
  const currentPage = page ? parseInt(page) : 1;

  const fetchData = async () => {
    const newData = await getSavedTrack(currentPage);
    setTracks(newData?.track_list || []);
    setIsNextPage(newData?.is_next_page || false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    router.push(`${pathname}?page=${nextPage}`);
  };

  const handlePreviousPage = () => {
    const prevPage = Math.max(currentPage - 1, 1);
    router.push(`${pathname}?page=${prevPage}`);
  };

  return (
    <Container sx={{ p: 3 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 3 }}>
        Saved Tracks
      </Typography>

      {tracks.length > 0 && (
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
          <TrackList tracks={tracks} />
        </Container>
      )}
    </Container>
  );
}
