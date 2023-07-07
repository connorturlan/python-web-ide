import CodeEditor from "@uiw/react-textarea-code-editor";
import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import "./styles/palette.scss";
import { usePython } from "react-py";
import { loadPyFiles, loadTextFiles, readFile } from "./utils/filesystem";
import { parse } from "yaml";
import { bindAnimationEnd } from "./utils/animations";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import TutorialPanel from "./components/TutorialPanel/TutorialPanel";
import Panel from "./components/Panel/Panel";
import Navbar from "./components/Navbar/Navbar";
import Modal from "./components/Modal/Modal";

var tutorials = [];

const loadTutorial = async () => {
  const rawFile = await readFile("./lessons.yaml");
  tutorials = parse(rawFile);
};

function App() {
  const [code, setCode] = useState(``);
  const [ready, setReady] = useState(false);
  const [pageIndex, setIndex] = useState(0);
  const [page, setPage] = useState(tutorials[pageIndex]);
  const [isModalVisible, setModalVisible] = useState(true);
  const [enableNext, setEnableNext] = useState(true);
  const [err, setError] = useState("");

  const {
    runPython,
    stdout,
    stderr,
    isLoading,
    interruptExecution,
    writeFile,
    mkdir,
  } = usePython();

  const runCode = () => {
    setError("");
    runPython(code);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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

    const nextPage = tutorials[pageIndex];

    setPage(nextPage);
    setCode(nextPage.example);
    setEnableNext(!nextPage.expect);
  }, [pageIndex]);

  // allow tests to block turning the page.
  // TODO: add page history.
  useEffect(() => {
    if (!isLoading && stdout && page.expect) {
      const isExpected = stdout == page.expect;
      setError(
        isExpected ? "" : `Expected: ${page.expect.slice(0, -1)}, Got ${stdout}`
      );
      setEnableNext(isExpected);
    }
  }, [stdout]);

  useEffect(() => {
    if (!isLoading) {
      setError(stderr);
    }
  }, [stderr]);

  return false ? (
    <LoadingScreen />
  ) : (
    <div className={styles.App_Container}>
      <Navbar>
        <button
          className={styles.Button}
          onClick={() => {
            setIndex(pageIndex - 1);
          }}
          disabled={pageIndex <= 0}
        >
          {"←"}
        </button>
        <button
          className={styles.Button + " " + styles.Tutorial_Toggle}
          onClick={toggleModal}
        >
          {isModalVisible ? "hide" : "show"}
        </button>
        <button
          className={styles.Button}
          onClick={() => {
            setIndex(pageIndex + 1);
          }}
          disabled={!enableNext || pageIndex >= tutorials.length - 1}
        >
          {"→"}
        </button>
      </Navbar>

      <Panel className={styles.App}>
        <Modal visible={isModalVisible}>
          <Panel className={styles.Tutorial}>
            <TutorialPanel tutorialObject={page} />
          </Panel>
        </Modal>

        <Panel className={styles.Editor}>
          <CodeEditor
            value={code}
            language="python"
            placeholder="Please enter Python code."
            onChange={(e) => setCode(e.target.value)}
            padding={15}
            autoComplete="yes"
            style={{
              fontSize: 14,
              backgroundColor: "#222",
              fontFamily:
                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            }}
          />
        </Panel>
        <div className={styles.Console}>
          <div className={styles.Console_Control}>
            <button
              id="ide-run"
              className={styles.Button}
              onClick={() => runCode(code)}
              disabled={isLoading}
            >
              RUN
            </button>
            <button
              id="ide-test"
              className={styles.Button}
              onClick={interruptExecution}
              disabled={isLoading}
            >
              STOP
            </button>
          </div>

          {/* stderr console. */}
          {err && (
            <pre id="console" className={styles.Error}>
              {err}
            </pre>
          )}

          {/* stdout console. */}
          <pre id="console" className={styles.Console}>
            {stdout}
          </pre>
        </div>
      </Panel>
    </div>
  );
}

export default App;
