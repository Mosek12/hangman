import TheLetter from "./Theletter";

interface Props {
  word: letter[];
  lettersGuessed: letter[];
}

const WordShower: React.FC<Props> = ({ word, lettersGuessed }) => {
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
