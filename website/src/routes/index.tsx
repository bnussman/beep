import React from "react";
import iPhoneDark from "../assets/dark.webp?url";
import iPhoneLight from "../assets/light.webp?url";
import { getDownloadLink } from "../utils/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from '@heroui/react';
import {
  Box,
  Container,
  Stack,
  Typography,
  useColorScheme,
} from "@mui/material";

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
              render={(props) => (
                <a
                  className={props.className}
                  ref={props.ref}
                  children={props.children}
                  href={getDownloadLink()}
                  target="_blank"
                />
              )}
              variant="primary"
              size="lg"
            >
              Download
            </Button>
          </Box>
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
