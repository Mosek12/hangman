import TheLetter from "./Theletter";

const WordShower = ({ word, lettersGuessed }) => {
  return (
    <div className="wordShower">
      {word.map((letter, index) => {
        return (
          <TheLetter
            letter={letter}
            key={index}
            lettersGuessed={lettersGuessed}
          />
        );
      })}
    </div>
  );
};

export default WordShower;
