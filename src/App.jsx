import CodeEditor from "@uiw/react-textarea-code-editor";
import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import { usePython } from "react-py";
import tutorials from "./data/lessons.json";
import { BuildTutorial } from "./utils/tutorial.jsx";
import { loadPyFiles, loadTextFiles } from "./utils/filesystem";

const highlightLine = (node, index, line) => {
  if (node.properties?.className?.includes("code-line")) {
    if (index % 2 === 0) {
      node.properties.className.push("ide-line--odd");
      console.log("~~~", index, node.properties?.className);
    }
  }
};

function App() {
  const [code, setCode] = useState(``);
  const [ready, setReady] = useState(false);
  const [pageIndex, setIndex] = useState(0);
  const [page, setPage] = useState(tutorials[pageIndex]);

  const {
    runPython,
    stdout,
    stderr,
    isLoading,
    isRunning,
    interruptExecution,
    writeFile,
    mkdir,
  } = usePython();

  const runCode = () => {
    runPython(code);
  };

  const loadFile = () => {
    console.log("pushing file to file system.");

    mkdir("src");
    loadTextFiles(writeFile);
    loadPyFiles(writeFile);
  };

  // enable the button.
  useEffect(() => {
    setReady(!isLoading && !isRunning);

    // load the
    if (!isLoading) {
      loadFile();
    }
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
    setCode(tutorials[pageIndex].example);
  }, [pageIndex]);

  return false ? (
    <div className={styles.ide_loading}>
      <div className={styles["lds-heart"]}>
        <div></div>
      </div>
    </div>
  ) : (
    <div className={styles.ide}>
      <div className={styles.ide_code}>
        <CodeEditor
          value={code}
          language="python"
          placeholder="Please enter Python code."
          onChange={(e) => setCode(e.target.value)}
          padding={15}
          autoComplete="yes"
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
        <div className={styles.ide_console_control}>
          <button
            id="ide-run"
            className={styles.ide_button}
            onClick={() => runCode(code)}
            disabled={!ready}
          >
            ►
          </button>
          <button
            id="ide-test"
            className={styles.ide_button}
            onClick={() => runCode(code)}
            disabled={!ready}
          >
            ►|
          </button>
        </div>

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
