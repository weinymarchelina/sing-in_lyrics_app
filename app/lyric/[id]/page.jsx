"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  List,
  ListItem,
  Container,
  Typography,
  IconButton,
  Card,
  ButtonGroup,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";

async function savePreference(preference) {
  try {
    await fetch(
      `http://localhost:3000/api/setPreference?preference=${preference}`
    );
  } catch (error) {
    console.log("Error setting preference: ", error);
  }
}

async function getAudio(textList) {
  try {
    const response = await fetch("http://localhost:3000/api/getAudio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio_data: textList }),
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  } catch (error) {
    console.log("Error getting audio: ", error);
  }
}

export default function LyricInfo() {
  const [mainData, setMainData] = useState(null);
  const [selectedPhonetic, setSelectedPhonetic] = useState("pinyin");
  const [phoneticsOn, setPhoneticsOn] = useState(true);
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const trackId = useParams().id;
  const [phoneticIndex, setPhoneticIndex] = useState(-1);
  const [lyric, setLyric] = useState([]);

  const handlePhoneticsIndex = (newSelectedPhonetic) => {
    const phoneticsList = ["original", "pinyin", "zhuyin", "jyutping"];
    const index = phoneticsList.indexOf(newSelectedPhonetic);

    if (index !== 0) {
      setPhoneticIndex(index);
    } else {
      setPhoneticIndex(-1);
    }
  };

  const handlePreference = async (event, newSelectedPhonetic) => {
    handlePhoneticsIndex(newSelectedPhonetic);
    setSelectedPhonetic(newSelectedPhonetic);
    await savePreference(newSelectedPhonetic);
  };

  useEffect(() => {
    async function fetchLyricData() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/lyric/${trackId}`
        );
        const data = await response.json();

        setMainData(data);
        setSelectedPhonetic(data?.preference || "pinyin");
        handlePhoneticsIndex(data?.preference);

        const script = {
          name: data?.track.name,
          album_name: data?.track.album_name,
          artists: data?.track.artists.map((artist) => artist.name).join(", "),
        };

        const audioUrl = await getAudio(script);
        setAudioUrl(audioUrl);

        setLyric(data?.lyric);

        setBgColor(data?.bg_color);
        setTextColor(data?.text_color);
        console.log(data?.lyric);
      } catch (error) {
        console.error("Error fetching lyric data:", error);
      }
    }

    fetchLyricData();
  }, [trackId]);

  if (!mainData) {
    return <div>Loading...</div>;
  }

  const { track, is_lyric_available } = mainData;

  const isChineseWord = (word) => {
    const regex = /^[\u4e00-\u9fff]+$/;
    console.log(`${word} = ${regex.test(word)}`);
    return regex.test(word);
  };

  const playAudio = () => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <Container sx={{ p: 3, backgroundColor: bgColor, color: textColor }}>
      {mainData && (
        <Container sx={{ py: 2, px: 0 }}>
          {track && (
            <Container sx={{ p: 0 }}>
              {track.album_img && track.album_img[0]?.url && (
                <Box
                  sx={{
                    p: 0,
                    minWidth: 250,
                    minHeight: 250,
                    boxShadow: "0px 0px 1rem 1rem rgba(0,0,0,0.12)",
                  }}
                >
                  <Image
                    src={track.album_img[0].url}
                    alt={`${track.album_name}_img`}
                    width={325}
                    height={325}
                  />
                </Box>
              )}
              <Container sx={{ pt: 3, px: 0 }}>
                <Typography variant="h4" component="h1">
                  {track.name}
                </Typography>
                <Typography
                  sx={{ py: 2, textTransform: "uppercase" }}
                  variant="h6"
                  component="h2"
                >
                  <Link href={`/album/${track.album_id}`}>
                    {track.album_name}
                  </Link>
                </Typography>

                {track?.artists && (
                  <Container sx={{ py: 3, px: 0 }}>
                    <Container
                      className="f-space"
                      sx={{ px: 0, alignItems: "center" }}
                    >
                      <Typography
                        sx={{ textTransform: "uppercase" }}
                        variant="h5"
                        component="h2"
                      >
                        Artist
                      </Typography>
                      {audioUrl && (
                        <IconButton onClick={playAudio}>
                          <RecordVoiceOverIcon />
                        </IconButton>
                      )}
                    </Container>
                    <List>
                      {track.artists.map((artist) => (
                        <ListItem sx={{ px: 0 }} key={artist.id}>
                          <Card
                            className="f-space"
                            sx={{ width: "100%", maxHeight: "100px" }}
                          >
                            <Box sx={{ minWidth: "100px" }}>
                              <Image
                                src={
                                  artist.img[1]?.url
                                    ? artist.img[1]?.url
                                    : "/backup.jpg"
                                }
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

          <Container sx={{ mb: 15, px: 0 }}>
            {is_lyric_available && (
              <>
                <Typography
                  sx={{ textTransform: "uppercase", py: 1 }}
                  variant="h5"
                  component="h2"
                >
                  Lyrics
                </Typography>
                <Container sx={{ py: 2, px: 0 }}>
                  <ToggleButtonGroup
                    value={selectedPhonetic}
                    onChange={handlePreference}
                    exclusive
                  >
                    <ToggleButton value="original">Original</ToggleButton>
                    <ToggleButton value="pinyin">Pinyin</ToggleButton>
                    <ToggleButton value="zhuyin">Zhuyin</ToggleButton>
                    <ToggleButton value="jyutping">Jyutping</ToggleButton>
                  </ToggleButtonGroup>
                </Container>
                {lyric.map((line) => (
                  <Container
                    sx={{
                      display: "flex",
                      alignItems: "self-start",
                      flexWrap: "wrap",
                      maxWidth: "100%",
                      px: 0,
                      pb: 1,
                    }}
                  >
                    {line.map((phrase) => {
                      return (
                        <Box sx={{ display: "flex" }}>
                          {phrase.map((word_list) => {
                            return (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  py: 1,
                                  pl: 0,
                                  pr: 2,
                                }}
                              >
                                {word_list.map((word) => {
                                  return (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                      }}
                                      style={{
                                        paddingRight: `${
                                          word.length > 1 ? "1.25rem" : "0"
                                        }`,
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          minHeight: "1rem",
                                        }}
                                      >
                                        {word[phoneticIndex]}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: "1.65rem",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {word[0]}
                                      </Typography>
                                    </Box>
                                  );
                                })}
                              </Box>
                            );
                          })}
                        </Box>
                      );
                    })}
                  </Container>
                ))}
              </>
            )}
            {!is_lyric_available && (
              <Typography variant="h6" component="p">
                Looks like this track doesn't have lyrics~
              </Typography>
            )}
          </Container>
        </Container>
      )}
    </Container>
  );
}
