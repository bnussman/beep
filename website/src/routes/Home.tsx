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
      <Stack height="calc(100vh - 150px)" width="100%" direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center">
        <Stack spacing={2} alignItems={{ xs: "center", md: 'flex-start' }}>
          <Typography fontWeight="bold" variant="h1" fontSize={{ xs: "3.0rem", md: "3.8rem" }}>
            Ride Beep App
          </Typography>
          <Typography textAlign={{ xs: 'center', md: 'unset' }}>
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
        <Box
          component="img" 
          sx={{ width: { xs: 400, md: 500 } }}
          src={colorScheme === "light" ? iPhoneLight : iPhoneDark}
        />
      </Stack>
    </Container>
  );
}
