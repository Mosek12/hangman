import React from "react";
import Popup from "reactjs-popup";
import { WARN } from "@/utils/logging";
import { useKeyDown } from "@/hooks/reactkeyboardinputhook";

const EndScreen = ({ open, setOpen, newGame, status, word }) => {
  const handleClose = () => {
    setOpen(false);
    newGame();
  };

  useKeyDown(
    () => {
      if (open) {
        handleClose();
      }
    },
    [13, 27, 32],
    []
  );

  return (
    <Popup open={open} modal closeOnDocumentClick onClose={handleClose}>
      {(() => {
        switch (status) {
          case "lose":
            return (
              <p>
                You lose! Word was &quot;{word.map((a) => a.toUpperCase())}
                &quot;
              </p>
            );

          case "win":
            return <p>You win!</p>;

          case "":
            () => WARN("Invalid status");
            return <p>Something went wrong</p>;
        }
      })()}
    </Popup>
  );
};

export default EndScreen;
