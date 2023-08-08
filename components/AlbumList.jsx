"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ListItem,
  List,
  Card,
  Box,
  Container,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

const AlbumList = ({ albums }) => {
  const router = useRouter();

  return (
    <List>
      {albums.map((album) => (
        <ListItem
          sx={{ px: 0, cursor: "pointer" }}
          key={album.id}
          onClick={() => router.push(`/album/${album.id}`)}
        >
          <Card
            className="f-space"
            variant="outlined"
            sx={{
              alignItems: "center",
              width: "100%",
              maxHeight: "100px",
              backgroundColor: "#181818",
              color: "#eee",
            }}
          >
            {album?.img && album?.img[0]?.url && (
              <Box sx={{ width: "115px" }}>
                <Image
                  src={album.img[0].url}
                  alt={`${album.name}_img`}
                  width={100}
                  height={100}
                />
              </Box>
            )}
            <Container
              sx={{ p: 2, overflow: "hidden", textOverflow: "ellipsis" }}
            >
              <Typography noWrap>{album.name}</Typography>
              <Typography variant="subtitle2">
                {album.artists.map((artist) => artist.name).join(", ")}
              </Typography>
            </Container>
          </Card>
        </ListItem>
      ))}
    </List>
  );
};

export default AlbumList;
