import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "@/utils/theme";
import { Link, AppBar, Box, Button, Container, CssBaseline, Toolbar, Typography } from "@mui/material";
import { default as NextLink } from 'next/link';
import { logout } from "./login/actions";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "Ride Beep App",
  description: "The rideshare app for college students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar component="nav">
              <Toolbar sx={{ gap: 2 }}>
                <Link href="/" component={NextLink} color="inherit" underline="none">
                  <Typography variant="h6" fontWeight="bold">
                    Beep 🚕
                  </Typography>
                </Link>
                <Box flexGrow={1} />
                <Button variant="outlined" onClick={logout}>
                  Logout 
                </Button>
                <Button variant="contained" href="/login" LinkComponent={Link}>
                  Login 
                </Button>
              </Toolbar>
            </AppBar>
            <Container sx={{ pt: 12}}>
              <main>
                {children}
              </main>
            </Container>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
