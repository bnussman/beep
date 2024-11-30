import { trpc } from "@/utils/trpc";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

async function getUser() {
  try {  
    return await trpc.user.me.query();
  } catch (error) {
    return null;
  }
}

export default async function Home() {
  const user = await getUser();

  if (!user) {
    return <Typography>Please Login</Typography>;
  }

  return (
    <Typography>
      Hello {user.first}
    </Typography>
  );
}
