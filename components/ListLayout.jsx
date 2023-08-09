"use client";
import { Box, Container, Typography, Card } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const Layout = ({
  pageTitle,
  items,
  currentPage,
  buttonCardContent,
  listContent,
}) => {
  const smallScreen = useMediaQuery("(max-width:720px)");

  return (
    <Container
      sx={{
        p: 3,
        pb: 30,
        minHeight: "100vh",
        backgroundColor: "#202020",
        color: "#eee",
        display: `${smallScreen ? "block" : "flex"}`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        maxWidth={"lg"}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {items?.length > 0 && (
          <>
            <Typography
              variant="h3"
              component="h1"
              sx={{ mb: 3, fontWeight: 600 }}
            >
              {pageTitle}
            </Typography>
            <Container
              sx={{
                px: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Container
                sx={{
                  gap: 2,
                  px: 0,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  component="p"
                  sx={{ textTransform: "uppercase" }}
                >{`Page ${currentPage}`}</Typography>
                <Card
                  variant="outlined"
                  sx={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
                >
                  {buttonCardContent}
                </Card>
              </Container>
              {listContent}
            </Container>
          </>
        )}
        {!items && (
          <>
            <Typography
              variant="h3"
              component="h1"
              sx={{ mb: 3, fontWeight: 600 }}
            >
              {pageTitle}
            </Typography>
            <Container sx={{ px: 0, py: 2 }}>
              <Typography variant="h4">
                Go add items to the list on Spotify~
              </Typography>
            </Container>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Layout;
