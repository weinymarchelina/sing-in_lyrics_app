"use client";
import React from "react";
import Image from "next/image";
import { List, ListItem, Typography, Card } from "@mui/material";
import { useRouter } from "next/navigation";

const AlbumTrackList = ({ tracks, textColor }) => {
  const router = useRouter();
  return (
    <List>
      {tracks.map((track) => (
        <ListItem
          className="f-col"
          key={track.id}
          sx={{ alignItems: "flex-start", px: 0, cursor: "pointer" }}
          onClick={() => router.push(`/lyric/${track.id}`)}
        >
          <Card
            variant="outlined"
            sx={{
              width: "100%",
              p: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              backgroundColor: "rgba(0, 0, 0, 0.15)",
              color: textColor,
            }}
          >
            <Typography variant="h6" component="p" sx={{ pb: 1 }} noWrap>
              {track.name}
            </Typography>
            <Typography variant="subtitle2" component="p" noWrap>
              {track.artists.map((artist) => artist.name).join(", ")}
            </Typography>
          </Card>
        </ListItem>
      ))}
    </List>
  );
};

export default AlbumTrackList;
