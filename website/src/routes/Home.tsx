import React from "react";
import iPhoneDark from "../assets/dark.png";
import iPhoneLight from "../assets/light.png";
import { createRoute } from "@tanstack/react-router";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useColorScheme,
} from "@mui/material";
import { rootRoute } from "../utils/root";
import { getDownloadLink } from "../utils/utils";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

export function Home() {
  const { colorScheme } = useColorScheme();

  return (
    <Container>
      <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
        <Stack spacing={2}>
          <Typography fontWeight="bold" variant="h1" fontSize="3.8rem">
            Ride Beep App
          </Typography>
          <Typography>
            A rideshare app for students. Ride or drive at your university
            today.
          </Typography>
          <Box>
            <Button
              component="a"
              href={getDownloadLink()}
              target="_blank"
              size="large"
              color="info"
              variant="contained"
            >
              Download
            </Button>
          </Box>
        </Stack>
        <img
          style={{ maxHeight: 800 }}
          src={colorScheme === "light" ? iPhoneLight : iPhoneDark}
        />
      </Stack>
    </Container>
  );
}
