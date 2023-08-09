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
import MainHeroPage from "../../components/MainHeroPage";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);
  const [popularTracks, setPopularTracks] = useState([]);
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [mainImageData, setMainImageData] = useState([]);
  const [bgColor, setBgColor] = useState("#202020");
  const [textColor, setTextColor] = useState("#eee");
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

  const fetchProfileData = async () => {
    try {
      const response = await fetch("/api/profile");
      const data = await response.json();
      setUserData(data);
      setTopArtists(data?.top_artists);

      if (data?.top_tracks.length > 20) {
        setTopTracks(data?.top_tracks.slice(0, 20));
      } else {
        setTopTracks(data?.top_tracks);
      }

      setBgColor(data?.bg_color);
      setTextColor(data?.text_color);
      setMainImageData(data?.img);

      const popularArtistsList = getMostPopularItems(data?.top_artists, 5);
      const popularTracksList = getMostPopularItems(data?.top_tracks, 16);
      setPopularArtists(popularArtistsList);
      setPopularTracks(popularTracksList);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
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
        <ListItem
          sx={{
            pb: 3,
            display: "flex",
            flexDirection: "column",
          }}
          key={items[0].id}
        >
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
              sx={{
                ...listItemStyle,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              variant="outlined"
            >
              <Box sx={{ width: "115px" }}>
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

  const outlinedButton = (clickEventFunction, children) => {
    return (
      <Button
        variant="outlined"
        onClick={clickEventFunction}
        sx={{
          m: 2,
          py: 2,
          color: textColor,
          borderColor: textColor,
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          ":hover": {
            borderColor: textColor,
            color: textColor,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {children}
      </Button>
    );
  };

  const moreTracksButtonContent = (
    <>
      {showAllTracks && "View Fewer Tracks"}
      {!showAllTracks && "View More Tracks"}
    </>
  );

  const heroContent = (
    <>
      {userData?.name && (
        <Typography
          sx={{
            py: 3,
            flex: 1,
            fontWeight: 600,
          }}
          variant={smallScreen ? "h3" : "h2"}
          component="h1"
        >
          {userData?.name}'s Music Taste
        </Typography>
      )}
    </>
  );

  const mainContent = (
    <>
      {topArtists.length > 0 && (
        <Container
          sx={{
            py: 3,
            px: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
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
        <Container
          sx={{
            py: 3,
            px: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{ alignSelf: "center", textAlign: "center" }}
          >
            Current Top Tracks
          </Typography>
          {renderItemList(topTracks)}
          {userData.top_tracks.length > 20 &&
            outlinedButton(handleMoreTracks, moreTracksButtonContent)}
          {renderPopularItemList(popularTracks)}
        </Container>
      )}
      {userData && (
        <Container
          sx={{
            width: "100%",
            py: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{ alignSelf: "center", textAlign: "center", pb: 3 }}
          >
            Settings
          </Typography>
          {outlinedButton(
            () => router.push("/api/logout"),
            <Typography>Logout</Typography>
          )}
        </Container>
      )}
    </>
  );

  return (
    <MainHeroPage
      smallScreen={smallScreen}
      bgColor={bgColor}
      textColor={textColor}
      heroCondition={userData?.name}
      imgUrl={mainImageData[1]?.url}
      imgAlt={`${userData?.name}_img`}
      heroContent={heroContent}
      mainContent={mainContent}
    />
  );
}
