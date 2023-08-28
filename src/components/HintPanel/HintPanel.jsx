import styles from "./HintPanel.module.scss";

function HintPanel({ lessons, pageIndex }) {
  const hints = lessons
    .slice(0, pageIndex + 1)
    .map((lesson) => lesson.hint)
    .filter((lesson) => !!lesson);

  const hintNodes = hints.map(({ title, content }) => {
    return (
      <pre
        className={styles.HintCodes}
        title={content}
        onClick={() => {
          alert(content);
        }}
      >
        {title}
      </pre>
    );
  });

  return <div className={styles.HintPanel}>{hintNodes}</div>;
}

export default HintPanel;
