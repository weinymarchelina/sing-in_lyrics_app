"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import AlbumTrackList from "../../../components/AlbumTrackList";
import {
  ListItem,
  Typography,
  Container,
  Box,
  List,
  Card,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

async function getAlbumTrack(albumId) {
  try {
    const url = `http://localhost:3000/api/album/${albumId}`;
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

export default function AlbumTrack() {
  const [albumInfo, setAlbumInfo] = useState({});
  const [tracks, setTracks] = useState([]);
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const albumId = useParams().id;
  const smallScreen = useMediaQuery("(max-width:720px)");

  const fetchData = async () => {
    const newData = await getAlbumTrack(albumId);
    console.log(newData);
    setTracks(newData?.track_list || []);
    setAlbumInfo(newData?.base_album_info || {});
    setBgColor(newData?.bg_color);
    setTextColor(newData?.text_color);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container
      className={smallScreen ? "" : "f-row"}
      sx={{ p: 3, backgroundColor: bgColor, color: textColor }}
    >
      <Box maxWidth={"lg"} sx={{ width: "100%" }}>
        {albumInfo && (
          <Container sx={{ py: 2, px: 0 }}>
            <Container
              sx={{
                py: 3,
                pb: 10,
                px: 0,
                gap: 5,
                alignItems: "center",
                maxWidth: `${smallScreen ? 320 : "auto"}`,
              }}
              className={smallScreen ? "f-col" : "f-row"}
            >
              {albumInfo?.img && albumInfo?.img[0]?.url && (
                <Box
                  sx={{
                    flex: 1,
                    maxWidth: 320,
                    maxHeight: 320,
                    boxShadow: "0px 0px 1rem 1rem rgba(0,0,0,0.12)",
                  }}
                >
                  <Image
                    src={albumInfo.img[0].url}
                    alt={`${albumInfo.name}_img`}
                    width={300}
                    height={300}
                  />
                </Box>
              )}
              <Container sx={{ pt: 3, px: 0, flex: 1 }}>
                <Typography variant={smallScreen ? "h4" : "h3"} component="h1">
                  {albumInfo.name}
                </Typography>
                {albumInfo.total_tracks && (
                  <Typography
                    sx={{ py: 2, textTransform: "uppercase" }}
                    variant={smallScreen ? "h6" : "h5"}
                    component="h2"
                  >
                    {albumInfo.total_tracks} tracks
                  </Typography>
                )}
              </Container>
            </Container>
            {albumInfo?.artists && (
              <Container sx={{ py: 3, px: 0 }}>
                <Typography
                  sx={{ textTransform: "uppercase" }}
                  variant="h5"
                  component="h2"
                >
                  Artist
                </Typography>
                <List>
                  {albumInfo.artists.map((artist) => (
                    <ListItem sx={{ px: 0 }} key={artist.id}>
                      <Card
                        className="f-space"
                        variant="outlined"
                        sx={{
                          width: "100%",
                          maxHeight: "100px",
                          backgroundColor: "rgba(0, 0, 0, 0.15)",
                          color: textColor,
                        }}
                      >
                        <Box sx={{ minWidth: "100px" }}>
                          <Image
                            src={artist.img[1].url}
                            alt={`${artist.name}_img`}
                            width={100}
                            height={100}
                          />
                        </Box>
                        <Container
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Typography variant="h5" component="p">
                            {artist.name}
                          </Typography>
                        </Container>
                      </Card>
                    </ListItem>
                  ))}
                </List>
              </Container>
            )}

            {tracks.length > 0 && (
              <Container sx={{ mt: 2, mb: 15, px: 0 }}>
                <Typography
                  sx={{ textTransform: "uppercase" }}
                  variant="h5"
                  component="h2"
                >
                  All tracks
                </Typography>
                <AlbumTrackList tracks={tracks} textColor={textColor} />
              </Container>
            )}
          </Container>
        )}
      </Box>
    </Container>
  );
}
