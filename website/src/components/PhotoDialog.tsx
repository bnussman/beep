import React from 'react';
import {
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay
} from "@chakra-ui/react";

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
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="2xl">
        <ModalCloseButton />
        <Image borderRadius="2xl" src={src} />
      </ModalContent>
    </Modal>
  );
}