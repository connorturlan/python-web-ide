import CodeEditor from "@uiw/react-textarea-code-editor";
import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import "./styles/palette.scss";
import { usePython } from "react-py";
import { TutorialPanel } from "./utils/tutorial.jsx";
import { loadPyFiles, loadTextFiles, readFile } from "./utils/filesystem";
import { parse } from "yaml";

var tutorials = [];

const loadTutorial = async (setCode) => {
  const rawFile = await readFile("./lessons.yaml");
  tutorials = parse(rawFile);
  console.log(tutorials[0]);
  const page = TutorialPanel({
    tutorialObject: tutorials[0],
    setCode,
  });
  console.log(page);
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

  const haltCode = () => {
    interruptExecution();
  };

  const loadModules = () => {
    console.log("pushing file to file system.");

    mkdir("src");
    loadTextFiles(writeFile);
    loadPyFiles(writeFile);
  };

  // on page load.
  useEffect(() => {
    loadTutorial(setCode);
  }, []);

  // enable the button.
  useEffect(() => {
    // load the module files.
    if (!isLoading) {
      loadModules();
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

  return isLoading ? (
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
            "--color-prettylights-syntax-string": "#98c379",
            fontSize: 14,
            backgroundColor: "#282c34",
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          }}
        />
      </div>

      <div className={styles.ide_tutorial}>
        <div className={styles.ide_control}>
          <button
            className={styles.ide_button}
            onClick={() => {
              setIndex(pageIndex - 1);
            }}
            disabled={pageIndex <= 0}
          >
            ⏮
          </button>
          <button
            className={styles.ide_button + " " + styles.ide_button__right}
            onClick={() => {
              setIndex(pageIndex + 1);
            }}
            disabled={pageIndex >= tutorials.length - 1}
          >
            ⏭
          </button>
        </div>
        <TutorialPanel tutorialObject={page} />
      </div>

      <div className={styles.ide_console}>
        <div className={styles.ide_console_control}>
          <button
            id="ide-run"
            className={styles.ide_button}
            onClick={() => runCode(code)}
            disabled={isLoading}
          >
            ⏵
          </button>
          <button
            id="ide-test"
            className={styles.ide_button}
            onClick={haltCode}
            disabled={isLoading}
          >
            ⏸
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
