import React from "react";
import iPhoneDark from "../assets/dark.png?url";
import iPhoneLight from "../assets/light.png?url";
import { getDownloadLink } from "../utils/utils";
import { createFileRoute } from "@tanstack/react-router";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useColorScheme,
} from "@mui/material";
// import { BeepsCount } from "../components/BeepsCount";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { colorScheme } = useColorScheme();

  return (
    <Container>
      <Stack
        height="calc(100vh - 150px)"
        width="100%"
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack spacing={2} alignItems={{ xs: "center", md: "flex-start" }}>
          <Typography
            fontWeight="bold"
            variant="h1"
            fontSize={{ xs: "3.0rem", md: "3.0rem", lg: "3.8rem" }}
            textAlign={{ xs: "center", sm: "center", md: "unset" }}
          >
            Ride Beep App
          </Typography>
          <Typography textAlign={{ xs: "center", md: "unset" }}>
            A rideshare app for students. Ride or drive at your university
            today.
          </Typography>
          <Box>
            <Button
              component="a"
              href={getDownloadLink()}
              target="_blank"
              size="large"
              color="primary"
              variant="contained"
            >
              Download
            </Button>
          </Box>
          {/*<BeepsCount />*/}
        </Stack>
        <picture>
          <source srcSet={iPhoneLight} media="(prefers-color-scheme: light)" />
          <source srcSet={iPhoneDark} media="(prefers-color-scheme: dark)" />
          <Box
            component="img"
            sx={{
              maxHeight: "min(max(80vh, 500px), 700px)",
              maxWidth: "calc(100vw - 64px)",
              objectFit: "contain",
              cursor: "zoom-in",
              transition: "transform 0.15s ease-in-out",
              ":hover": {
                transform: "scale(1.1)",
              },
            }}
            src={iPhoneLight}
            alt="iPhone Mockup of the Beep App"
            fetchPriority="high"
          />
        </picture>
      </Stack>
    </Container>
  );
}
