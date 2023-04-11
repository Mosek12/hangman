import Popup from "reactjs-popup";
import { WARN } from "../utils/logging";
import { useKeyDown } from "../hooks/reactkeyboardinputhook";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newGame: () => void;
  status: gameEndStatusType;
  word: letter[];
}

const EndScreen: React.FC<Props> = ({
  open,
  setOpen,
  newGame,
  status,
  word,
}) => {
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

          case "error":
            return <p>Something went wrong</p>;

          case "":
            () => WARN("Invalid status");
            return <p>Something went wrong</p>;
        }
      })()}
    </Popup>
  );
};

export default EndScreen;
