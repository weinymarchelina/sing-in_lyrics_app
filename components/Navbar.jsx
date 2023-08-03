"use client";

import Link from "next/link";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  ButtonGroup,
  Card,
  Container,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const Navbar = ({ trackId }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState("/library");
  const matches = useMediaQuery("(max-width:720px)");

  useEffect(() => {
    console.log(pathname);
    setValue(pathname);
  }, [pathname, value]);

  return (
    <BottomNavigation
      showLabels
      value={value}
      className="f-row"
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
    >
      <BottomNavigationAction
        label="Library"
        value="/library"
        icon={<HomeIcon />}
        onClick={() => router.push("/library")}
      />
      {matches && (
        <BottomNavigationAction
          label="Lyric"
          value="/lyric"
          icon={<LibraryMusicIcon />}
          onClick={() => router.push(`/lyric/${trackId}`)}
        />
      )}
      <BottomNavigationAction
        label="Profile"
        value="/profile"
        icon={<PersonIcon />}
        onClick={() => router.push("/profile")}
      />

      {/*
        <ButtonGroup>
          <Button>
            <Link href="/library">Library</Link>
          </Button>
          <Button>
            <Link href="/profile">Profile</Link>
          </Button>
        </ButtonGroup>
        <li>
          <Link href="/api/logout">Logout</Link>
        </li>
       */}
    </BottomNavigation>
  );
};

export default Navbar;
