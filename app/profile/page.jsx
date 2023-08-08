"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Container,
  List,
  ListItem,
  Typography,
  Box,
  Card,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);
  const [popularTracks, setPopularTracks] = useState([]);
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const router = useRouter();
  const smallScreen = useMediaQuery("(max-width:820px)");

  const getMostPopularItems = (_itemList, _amount) => {
    let amount = _amount;
    const itemList = _itemList.slice();

    if (_amount < 0 || itemList.length < _amount) {
      amount = itemList.length;
    }

    const sortedItems = itemList.sort((a, b) => b.popularity - a.popularity);

    return sortedItems.slice(0, amount);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/profile");
        const data = await response.json();
        console.log(data);
        setUserData(data);

        setTopArtists(data?.top_artists);

        if (data?.top_tracks.length > 20) {
          setTopTracks(data?.top_tracks.slice(0, 20));
        } else {
          setTopTracks(data?.top_tracks);
        }

        setBgColor(data?.bg_color || "");
        setTextColor(data?.text_color || "");

        const popularArtistsList = getMostPopularItems(data?.top_artists, 5);
        const popularTracksList = getMostPopularItems(data?.top_tracks, 16);
        setPopularArtists(popularArtistsList);
        setPopularTracks(popularTracksList);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleMoreTracks = () => {
    if (!showAllTracks) {
      setTopTracks(userData.top_tracks);
    } else {
      setTopTracks(userData?.top_tracks.slice(0, 20));
    }

    setShowAllTracks(!showAllTracks);
  };

  const listItemStyle = {
    width: "100%",
    maxHeight: "100px",
    backgroundColor: "rgba(0, 0, 0, 0.20)",
    color: textColor,
  };

  const renderItemList = (items) => {
    return (
      <List>
        <ListItem className="f-col" sx={{ pb: 3 }} key={items[0].id}>
          <Box sx={{ py: 2 }}>
            <Image
              src={items[0].img[0].url ? items[0].img[0].url : "/backup.jpg"}
              alt={`${items[0].name}_img`}
              width={items[0].img[1].width}
              height={items[0].img[1].height}
            />
          </Box>
          <Typography
            variant="h4"
            component="p"
          >{`${items[0].name}`}</Typography>
        </ListItem>
        {items.slice(1).map((item, index) => (
          <ListItem key={item.id}>
            <Card
              className="f-space"
              sx={{
                ...listItemStyle,
              }}
              variant="outlined"
            >
              <Box sx={{ width: "120px" }}>
                <Image
                  src={item.img[1]?.url ? item.img[1]?.url : "/backup.jpg"}
                  alt={`${item.name}_img`}
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
                <Typography
                  variant={smallScreen ? "subtitle" : "h5"}
                  component="p"
                >
                  {`${index + 2}. ${item.name}`}
                </Typography>
              </Container>
            </Card>
          </ListItem>
        ))}
      </List>
    );
  };

  const renderPopularItemList = (items) => {
    return (
      <Container
        sx={{
          display: "flex",
          flexDirection: `${smallScreen ? "column" : "row"}`,
          pt: 2,
        }}
      >
        <Container sx={{ flex: 1, flexGrow: 1, px: 0, pb: 0, pt: 2 }}>
          <Typography sx={{ textTransform: "uppercase", pr: 3 }} variant="h5">
            Popularity
          </Typography>
        </Container>
        <List
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            flex: 2,
            flexGrow: 5,
            gap: 2,
          }}
        >
          {items.map((item) => (
            <ListItem
              className="f-col"
              key={item.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: `${smallScreen ? "center" : "flex-end"}`,
                flex: 1,
                px: 0,
                py: 1,
                textAlign: `${smallScreen ? "center" : "right"}`,
              }}
            >
              <Box sx={{ width: "100px", pb: 1 }}>
                <Image
                  src={item.img[1]?.url ? item.img[1]?.url : "/backup.jpg"}
                  alt={`${item.name}_img`}
                  width={100}
                  height={100}
                />
              </Box>
              <Typography>{item.name}</Typography>
            </ListItem>
          ))}
        </List>
      </Container>
    );
  };

  return (
    <Container
      className={smallScreen ? "" : "f-row"}
      sx={{ p: 3, pb: 25, backgroundColor: bgColor, color: textColor }}
    >
      <Box className="f-col" maxWidth={"lg"} sx={{ width: "100%" }}>
        {userData && (
          <>
            <Container
              className={smallScreen ? "f-col" : "f-row"}
              sx={{
                py: 3,
                pb: 10,
                px: 0,
                gap: 5,
                alignItems: "center",
                maxWidth: `${smallScreen ? 320 : "auto"}`,
              }}
            >
              <Box
                sx={{
                  boxShadow: "0px 0px 1rem 1rem rgba(0,0,0,0.12)",
                  flex: 1,
                  maxWidth: 320,
                  maxHeight: 320,
                }}
              >
                <Image
                  src={
                    userData.img[1].url ? userData.img[1].url : "/backup.jpg"
                  }
                  alt={`${userData.name}_img`}
                  width={320}
                  height={330}
                />
              </Box>
              <Typography
                sx={{
                  py: 3,
                  flex: 1,
                  width: "calc(1vw + 300px)",
                  fontWeight: 600,
                }}
                variant={smallScreen ? "h3" : "h2"}
                component="h1"
              >
                {userData.name}'s Music Taste
              </Typography>
            </Container>
            {topArtists.length > 0 && (
              <Container className="f-col" sx={{ py: 3, px: 0 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ alignSelf: "center", textAlign: "center" }}
                >
                  Current Top Artists
                </Typography>
                {renderItemList(topArtists)}
                {renderPopularItemList(popularArtists)}
              </Container>
            )}
            {topTracks.length > 0 && (
              <Container className="f-col" sx={{ py: 3, px: 0 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ alignSelf: "center", textAlign: "center" }}
                >
                  Current Top Tracks
                </Typography>
                {renderItemList(topTracks)}
                {userData.top_tracks.length > 20 && (
                  <Button
                    variant="outlined"
                    onClick={handleMoreTracks}
                    sx={{
                      m: 2,
                      color: textColor,
                      borderColor: textColor,
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {showAllTracks && "View Fewer Tracks"}
                    {!showAllTracks && "View More Tracks"}
                  </Button>
                )}
                {renderPopularItemList(popularTracks)}
              </Container>
            )}
            <Container className="f-col" sx={{ width: "100%", py: 3 }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{ alignSelf: "center", textAlign: "center", pb: 3 }}
              >
                Settings
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  width: "100%",
                  py: 2,
                  color: textColor,
                  borderColor: textColor,
                }}
                onClick={() => router.push("/api/logout")}
              >
                <Typography>Logout</Typography>
              </Button>
            </Container>
          </>
        )}
      </Box>
    </Container>
  );
}
