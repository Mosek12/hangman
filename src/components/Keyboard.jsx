import KeyCap from "./Keycap";

const Keyboard = ({ letterUsedTable, handleClick }) => {
  return (
    <div className="keyboard">
      {letterUsedTable.map(({ letter, value }, index) => {
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