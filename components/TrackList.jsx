"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  List,
  ListItem,
  Box,
  Typography,
  Card,
  Container,
} from "@mui/material";

const TrackList = ({ tracks }) => {
  return (
    <List sx={{ mb: 15 }}>
      {tracks.map((track) => (
        <ListItem
          sx={{ px: 0, cursor: "pointer" }}
          key={track.id}
          onClick={() => router.push(`/lyric/${track.id}`)}
        >
          <Card
            className="f-space"
            variant="outlined"
            sx={{
              px: 0,
              alignItems: "center",
              width: "100%",
              maxHeight: "100px",
            }}
          >
            {track.album_img[1].url && (
              <Box sx={{ minWidth: "100px" }}>
                <Image
                  src={track.album_img[1].url}
                  alt={`${track.name}_img`}
                  width={100}
                  height={100}
                />
              </Box>
            )}
            <Container
              sx={{ p: 2, overflow: "hidden", textOverflow: "ellipsis" }}
            >
              <Typography noWrap>{track.name}</Typography>
              <Typography variant="subtitle2" noWrap>
                {track.artists.map((artist) => artist.name).join(", ")}
              </Typography>
            </Container>
          </Card>
        </ListItem>
      ))}
    </List>
  );
};

export default TrackList;
