const KeyCap = ({ letter, keyActive, handleClick, index }) => {
  return (
    <button
      className="button"
      onClick={() => handleClick(index, letter)}
      disabled={!keyActive}
    >
      {letter.toUpperCase()}
    </button>
  );
};

export default KeyCap;
