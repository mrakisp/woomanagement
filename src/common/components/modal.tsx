import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// TO DO
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface ModalProps {
  component: React.ReactNode;
  open: boolean;
  handleClose: () => void;
}

export default function BasicModal(props: ModalProps) {
  const { component, open = false, handleClose } = props;
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{component}</Box>
      </Modal>
    </div>
  );
}
