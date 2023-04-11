import KeyCap from "./Keycap";

interface Props {
  lettersUsed: letterUsed[];
  handleClick: (letter: letter) => void;
}

const Keyboard: React.FC<Props> = ({ lettersUsed, handleClick }) => {
  return (
    <div className="keyboard">
      {lettersUsed.map(({ letter, value }, index) => {
        return (
          <KeyCap
            key={index}
            letter={letter}
            keyActive={value}
            handleClick={handleClick}
          />
        );
      })}
    </div>
  );
};

export default Keyboard;
