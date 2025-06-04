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
    <Dialog open={isOpen} onClose={onClose}>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[400],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box component="img" src={src} sx={{ objectFit: 'contain', width: '100%', height: 'calc(100% - 10px)' }} />
      </DialogContent>
    </Dialog>
  );
}
