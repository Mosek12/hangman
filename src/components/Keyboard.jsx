import KeyCap from "./Keycap";

const Keyboard = ({ lettersUsed, handleClick }) => {
  return (
    <div className="keyboard">
      {lettersUsed.map(({ letter, value }, index) => {
        return (
          <KeyCap
            key={index}
            index={index}
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
