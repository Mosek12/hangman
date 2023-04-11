interface Props {
  letter: letter;
  keyActive: boolean;
  handleClick: (letter: letter) => void;
}

const KeyCap: React.FC<Props> = ({ letter, keyActive, handleClick }) => {
  return (
    <button
      className="button"
      onClick={() => handleClick(letter)}
      disabled={!keyActive}
    >
      {letter.toUpperCase()}
    </button>
  );
};

export default KeyCap;
