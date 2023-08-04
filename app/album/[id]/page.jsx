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
    <Container sx={{ p: 3, backgroundColor: bgColor, color: textColor }}>
      {albumInfo && (
        <Container sx={{ py: 2, px: 0 }}>
          {albumInfo && (
            <Container sx={{ p: 0 }}>
              {albumInfo?.img && albumInfo?.img[0]?.url && (
                <Box sx={{ minWidth: 250, minHeight: 250 }}>
                  <Image
                    src={albumInfo.img[0].url}
                    alt={`${albumInfo.name}_img`}
                    width={325}
                    height={325}
                  />
                </Box>
              )}
              <Container sx={{ pt: 3, px: 0 }}>
                <Typography variant="h4" component="h1">
                  {albumInfo.name}
                </Typography>
                <Typography
                  sx={{ py: 2, textTransform: "uppercase" }}
                  variant="h6"
                  component="h2"
                >
                  {albumInfo.total_tracks} tracks
                </Typography>

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
                            sx={{ width: "100%", maxHeight: "100px" }}
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
              </Container>
            </Container>
          )}
          {tracks.length > 0 && (
            <Container sx={{ mt: 2, mb: 15, px: 0 }}>
              <Typography
                sx={{ textTransform: "uppercase" }}
                variant="h5"
                component="h2"
              >
                All saved albums
              </Typography>
              <AlbumTrackList tracks={tracks} />
            </Container>
          )}
        </Container>
      )}
    </Container>
  );
}
