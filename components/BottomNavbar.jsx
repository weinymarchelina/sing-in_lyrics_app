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
import { styled } from "@mui/material/styles";
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BottomNavbar = ({ trackId = "" }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState("/library");

  useEffect(() => {
    const parts = pathname.split("/");
    const newValue = "/" + parts[1];
    setValue(newValue);
  }, [pathname]);

  const BottomNavigationAction = styled(MuiBottomNavigationAction)({
    "&.Mui-selected, &.Mui-selected:hover": {
      color: "#777",
    },
  });

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        height: "100%",
        bottom: "0px",
        position: "absolute",
        bottom: "0px",
        left: "0px",
        right: "0px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BottomNavigationAction
        label="Library"
        value="/library"
        icon={<HomeIcon />}
        onClick={() => router.push("/library")}
        sx={{ color: "#eee", textTransform: "uppercase", gap: 0.5 }}
      />
      <BottomNavigationAction
        label="Lyric"
        value="/lyric"
        icon={<LibraryMusicIcon />}
        onClick={() => router.push(`/lyric/${trackId}`)}
        sx={{ color: "#eee", textTransform: "uppercase", gap: 0.5 }}
      />
      <BottomNavigationAction
        label="Profile"
        value="/profile"
        icon={<PersonIcon />}
        onClick={() => router.push("/profile")}
        sx={{ color: "#eee", textTransform: "uppercase", gap: 0.5 }}
      />
    </BottomNavigation>
  );
};

export default BottomNavbar;
