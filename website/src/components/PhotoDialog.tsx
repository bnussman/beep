import React from 'react';
import {
  Image,
  Modal,
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius="2xl">
        <Image borderRadius="2xl" src={src} />
      </ModalContent>
    </Modal>
  );
}