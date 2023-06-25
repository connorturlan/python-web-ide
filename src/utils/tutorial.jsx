export const BuildTutorial = ({ o, setCode }) => {
  const { title, content, example } = o;

  return (
    <>
      <h1>{title}</h1>
      {content.map((line, index) => {
        return line.at(0) == "$" ? (
          <pre key={index}>{line.slice(1)}</pre>
        ) : (
          <p key={index}>{line}</p>
        );
      })}
    </>
  );
};

export default BuildTutorial;
