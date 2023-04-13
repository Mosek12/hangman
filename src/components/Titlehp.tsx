const TitleHP: React.FC<{ hp: hp[] }> = ({ hp }) => {
  return (
    <h1 className="titleHp">
      {hp.map(({ letter, value }, index) => {
        return (
          <span key={index}>
            {value ? letter.toLocaleUpperCase() : <span>&nbsp;</span>}
          </span>
        );
      })}
    </h1>
  );
};

export default TitleHP;
