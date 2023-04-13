interface Props {
  letter: letter;
  lettersGuessed: letter[];
}

const TheLetter: React.FC<Props> = ({ letter, lettersGuessed }) => {
  return (
    <div className="theLetterContainer">
      {lettersGuessed.includes(letter) ? <p className="theLetter">{letter}</p> : <p></p>}
    </div>
  );
};

export default TheLetter;
