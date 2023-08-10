"use client";
import { useState, useEffect } from "react";
import TrackList from "../../../components/TrackList";
import {
  useRouter,
  useParams,
  useSearchParams,
  usePathname,
} from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Container, Card, IconButton, Typography } from "@mui/material";
import MainHeroPage from "../../../components/MainHeroPage";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

async function getPlaylistTrack(playlistId, page = 1) {
  try {
    const url = `/api/playlist/${playlistId}?page=${page}`;
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
  const [bgColor, setBgColor] = useState("#202020");
  const [textColor, setTextColor] = useState("#eee");
  const [mainImageData, setMainImageData] = useState([]);
  const smallScreen = useMediaQuery("(max-width:720px)");

  const fetchData = async () => {
    const newData = await getPlaylistTrack(playlistId, currentPage);
    setPlaylist(newData || {});
    setMainImageData(newData?.img);
    setBgColor(newData?.bg_color);
    setTextColor(newData?.text_color);
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

  const heroContent = (
    <>
      <Typography variant={smallScreen ? "h3" : "h2"} component="h1">
        {playlist.name}
      </Typography>
      {playlist.total_tracks && (
        <Typography
          sx={{ py: 2, textTransform: "uppercase" }}
          variant={smallScreen ? "h6" : "h5"}
          component="h2"
        >
          {playlist.total_tracks} tracks
        </Typography>
      )}
    </>
  );

  const mainContent = (
    <>
      {playlist?.track_list?.length > 0 && (
        <Container sx={{ my: 5, px: 0 }}></Container>
      )}
      {playlist?.track_list?.length > 0 && (
        <Container sx={{ my: 5, px: 0 }}>
          <Typography
            variant="h4"
            sx={{ textTransform: "uppercase", py: 3 }}
            component="h2"
          >
            All tracks
          </Typography>

          <Container
            sx={{
              px: 0,
              alignItems: "flex-end",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h5"
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
          <TrackList tracks={playlist.track_list} textColor={textColor} />
        </Container>
      )}
    </>
  );

  return (
    <MainHeroPage
      smallScreen={smallScreen}
      bgColor={bgColor}
      textColor={textColor}
      heroCondition={playlist.name}
      imgUrl={mainImageData[0]?.url}
      imgAlt={`${playlist.name}_img`}
      heroContent={heroContent}
      mainContent={mainContent}
    />
  );
}
