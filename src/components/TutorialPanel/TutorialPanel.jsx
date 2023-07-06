import styles from "./TutorialPanel.module.scss";

export const TutorialPanel = ({ tutorialObject }) => {
  if (!tutorialObject) return;

  const { title, content } = tutorialObject ?? {
    title: "null",
    content: "null",
  };

  return (
    <>
      <h1>{title}</h1>
      {content.split("\n").map((line, index) => {
        return line.at(0) == "$" ? (
          <pre key={index}>{line.slice(1)}</pre>
        ) : (
          <p key={index}>{line}</p>
        );
      })}
    </>
  );
};

export default TutorialPanel;
