"use client";

import Link from "next/link";
import {
  AppBar,
  BottomNavigation,
  Button,
  ButtonGroup,
  Card,
  Container,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState("/library");

  useEffect(() => {
    const parts = pathname.split("/");
    const newValue = "/" + parts[1];
    setValue(newValue);
  }, [pathname]);

  return (
    <AppBar
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      className="f-row"
      sx={{
        backgroundColor: "black",
        height: "calc(2.5rem + 5vh)",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",

          // maxWidth: "1200px",
        }}
      >
        <Container
          className="f-row"
          sx={{ width: "200px", m: 0, cursor: "pointer" }}
          onClick={() => router.push("/library")}
        >
          <img src="/base_brand.png" alt="singin_icon" />
        </Container>
        <List className="f-row" sx={{ px: 2 }}>
          <ListItem>
            <Typography variant="button">
              <Link href={"/library/playlist"}>Playlist</Link>
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="button" noWrap>
              <Link href={"/library/savedTrack"}>Saved Track</Link>
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="button" noWrap>
              <Link href={"/library/savedAlbum"}>Saved Album</Link>
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="button">
              <Link href={"/profile"}>Profile</Link>
            </Typography>
          </ListItem>
        </List>
      </Container>
    </AppBar>
  );
};

export default Navbar;
