import React from "react";
import Popup from "reactjs-popup";
import { serverRuntimeConfig } from "../../next.config";

const EndScreen = ({ open, setOpen, newGame }) => {
  const handleClose = () => {
    setOpen(false);
    newGame();
  };

  return (
    <Popup open={open} modal closeOnDocumentClick onClose={handleClose}>
      <div>Popup content here !!</div>
    </Popup>
  );
};

export default EndScreen;
