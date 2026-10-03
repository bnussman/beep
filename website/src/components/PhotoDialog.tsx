import React from "react";
import { Modal } from "@heroui/react";

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
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop className="bg-black/80">
        <Modal.Container className="w-auto max-w-[90vw] bg-transparent p-0 shadow-none">
          <Modal.Dialog
            aria-label="User photo"
            className="relative border-0 bg-transparent p-0 shadow-none"
          >
            <Modal.CloseTrigger
              aria-label="Close photo"
              className="absolute right-2 top-2 z-10 text-white"
            />
            <Modal.Body className="p-0">
              <img
                src={src}
                alt="User photo"
                className="block max-h-[90vh] max-w-[90vw] rounded object-contain"
              />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
