import { trpc } from "@/utils/trpc";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

export default async function Home() {
  const t = await trpc.user.me.query();

  return (
    <main>
      <Typography>
        Hello {t.first}
      </Typography>
    </main>
  );
}
