import React from "react";
import { Box, Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  src: string | undefined | null;
}

export function PhotoDialog(props: Props) {
  const { isOpen, onClose, src } = props;

  if (!src) {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={onClose} slotProps={{ paper: { sx: { backgroundColor: 'transparent', borderRadius: '2.5%' } } }}>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[200],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0, overflow: 'hidden', backgroundColor: 'transparent' }}>
        <Box component="img" src={src} sx={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      </DialogContent>
    </Dialog>
  );
}
