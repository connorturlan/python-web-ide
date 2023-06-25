import CodeEditor from "@uiw/react-textarea-code-editor";
import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import { usePython } from "react-py";
import tutorials from "./lessons.json";
import { BuildTutorial } from "./utils/tutorial.jsx";

function App() {
  const [code, setCode] = useState(``);
  const [ready, setReady] = useState(false);
  let [pageIndex, setIndex] = useState(0);
  const [page, setPage] = useState(tutorials[pageIndex]);

  const {
    runPython,
    stdout,
    stderr,
    isLoading,
    isRunning,
    interruptExecution,
  } = usePython();

  const runCode = () => {
    runPython(code);
  };

  // enable the button.
  useEffect(() => {
    setReady(!isLoading && !isRunning);
  }, [isLoading]);

  // update the page.
  useEffect(() => {
    if (pageIndex < 0) {
      setIndex(0);
      return;
    } else if (pageIndex >= tutorials.length) {
      setIndex(tutorials.length - 1);
      return;
    }

    setPage(tutorials[pageIndex]);
    setCode(page.example);
  }, [pageIndex]);

  return (
    <div className={styles.ide}>
      <div className={styles.ide_code}>
        <CodeEditor
          value={code}
          language="python"
          placeholder="Please enter Python code."
          onChange={(e) => setCode(e.target.value)}
          padding={15}
          style={{
            fontSize: 12,
            backgroundColor: "#111",
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          }}
        />
      </div>

      <div className={styles.ide_tutorial}>
        <div className={styles.ide_control}>
          <button
            onClick={() => {
              setIndex(pageIndex - 1);
            }}
            disabled={pageIndex <= 0}
          >
            ←
          </button>
          <button
            onClick={() => {
              setIndex(pageIndex + 1);
            }}
            disabled={pageIndex >= tutorials.length - 1}
          >
            →
          </button>
        </div>
        <BuildTutorial o={page} setCode={setCode} />
      </div>

      <div className={styles.ide_console}>
        <button id="ide-run" onClick={() => runCode(code)} disabled={!ready}>
          {ready ? "run" : "loading..."}
        </button>

        {/* stderr console. */}
        {stderr && (
          <pre id="console" className={styles.ide_error}>
            {stderr}
          </pre>
        )}

        {/* stdout console. */}
        <pre id="console" className={styles.ide_output}>
          {stdout}
        </pre>
      </div>
    </div>
  );
}

export default App;
