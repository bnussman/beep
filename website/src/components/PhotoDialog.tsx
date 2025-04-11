import React from "react";
import { Dialog, DialogContent } from "@mui/material";

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
      <DialogContent>
        <img src={src} />
      </DialogContent>
    </Dialog>
  );
}
