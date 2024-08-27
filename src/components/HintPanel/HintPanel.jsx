import { useState } from "react";
import styles from "./HintPanel.module.scss";
import HintModal from "../HintModal/HintModal";

function HintPanel({ lessons, pageIndex }) {
  const hints = lessons
    .slice(0, pageIndex + 1)
    .map((lesson) => lesson.hint)
    .filter((lesson) => !!lesson);

  const [hintState, setState] = useState(
    hints.reduce((hint, all) => {
      all[hint.title] = false;
      return all;
    }, {})
  );

  const hintNodes = hints.map((hint) => {
    const { title, content } = hint;
    return (
      <pre
        className={styles.HintCodes}
        title={content}
        onClick={() => {
          // alert(content);
          hintState[title] = true;
          console.log("clicked on");
          setState({ ...hintState });
        }}
      >
        {title}
        {hintState[title] && (
          <HintModal
            hideFunc={(event) => {
              event.stopPropagation();
              console.log("clicked off");
              hintState[title] = false;
              setState({ ...hintState });
            }}
          >
            {
              <>
                <h2>{title}</h2>
                <pre>{content}</pre>
              </>
            }
          </HintModal>
        )}
      </pre>
    );
  });

  return <div className={styles.HintPanel}>{hintNodes}</div>;
}

export default HintPanel;
