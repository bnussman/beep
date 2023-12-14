import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from "@chakra-ui/react";

interface Props {
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
  actions?: JSX.Element[];
  onClose: () => void;
}

export function Dialog(props: Props) {
  const { isOpen, onClose, title, children } = props;

  const ref = React.useRef(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={ref}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          {children}
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
