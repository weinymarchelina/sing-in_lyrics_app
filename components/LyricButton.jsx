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
} from "@mui/material";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

const LyricButton = ({ trackId }) => {
  return (
    <Container>
      <IconButton>
        <Link href={`/lyric/${trackId}`}>
          <LibraryMusicIcon fontSize="large" />
        </Link>
      </IconButton>
    </Container>
  );
};

export default Navbar;
