const TheLetter = ({ letter, lettersGuessed }) => {
  return (
    <div className="toDisplay">
      {lettersGuessed.includes(letter) ? (
        <p className="toDisplayText">{letter}</p>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default TheLetter;
