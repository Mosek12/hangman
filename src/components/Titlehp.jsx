const TitleHP = ({ hp }) => {
  return (
    <h1 className="textH1">
      {hp.map(({ letter, value }, index) => {
        return <span key={index}>{value ? letter : <span>&nbsp;</span>}</span>;
      })}
    </h1>
  );
};

export default TitleHP;
