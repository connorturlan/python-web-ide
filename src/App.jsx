import CodeEditor from "@uiw/react-textarea-code-editor";
import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import "./styles/palette.scss";
import { usePython } from "react-py";
import { loadPyFiles, loadTextFiles, readFile } from "./utils/filesystem";
import { parse } from "yaml";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import TutorialPanel from "./components/TutorialPanel/TutorialPanel";
import Panel from "./components/Panel/Panel";
import Navbar from "./components/Navbar/Navbar";
import Modal from "./components/Modal/Modal";

import {
  getCookie,
  setCookie,
  SaveCode,
  LoadCode,
  SaveTestResult,
  LoadTestResult,
} from "./utils/cookies";
import HintPanel from "./components/HintPanel/HintPanel";

var tutorials = [];
const DEBUG = false;

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
  const [solution, setSolution] = useState("");
  const [solutionAvailable, allowSolution] = useState(true);
  const [solutionVisible, showSolution] = useState(false);

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

  const ChangePage = (i) => {
    // save the code for this page.
    SaveCode(pageIndex, code);

    // update the page.
    setIndex(pageIndex + i);
    setModalVisible(true);
  };

  const ResetCode = () => {
    setCookie(`Code${pageIndex}`, "");
    setCode(page.example);
  };

  const ShowSolution = () => {
    showSolution(!solutionVisible);
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

    // update the state.
    setPage(nextPage);
    setCode(LoadCode(pageIndex) || nextPage.example);
    setSolution(nextPage.solution || nextPage.example);
    setEnableNext(!nextPage.isTest || LoadTestResult(pageIndex));

    // hide the solution.
    allowSolution(false);
    showSolution(false);

    // allow the solution after 2 minutes.
    setTimeout(() => {
      allowSolution(true);
    }, 120_000);
  }, [pageIndex]);

  // allow tests to block turning the page.
  useEffect(() => {
    if (!isLoading && stdout && page.expect) {
      // check the cached expected result.
      const isExpected = stdout == page.expect;

      // set the error string depending on the result.
      setError(
        isExpected
          ? ""
          : `Expected:\n"${page.expect.slice(
              0,
              -1
            )}"\n\nBut got:\n"${stdout.slice(0, -1)}"`
      );

      // enable or disable the next page button.
      setEnableNext(isExpected || LoadTestResult(pageIndex));
      SaveTestResult(pageIndex, isExpected || LoadTestResult(pageIndex));
    }
    if (!isLoading && stdout && page.expect_end) {
      // check the cached expected result.
      const output = stdout.slice(0, -1).split("\n").at(-1);
      const isExpected = output == page.expect_end;
      console.log(output, page.expect_end);

      // set the error string depending on the result.
      setError(
        isExpected
          ? ""
          : `Expected output to end with:\n"${page.expect_end}"\n\nBut got:\n"${output}"`
      );

      // enable or disable the next page button.
      setEnableNext(isExpected || LoadTestResult(pageIndex));
      SaveTestResult(pageIndex, isExpected || LoadTestResult(pageIndex));
    }
  }, [stdout]);

  useEffect(() => {
    if (!isLoading) {
      setError(stderr);
    }
  }, [stderr]);

  return isLoading && !DEBUG ? (
    <LoadingScreen />
  ) : (
    <div className={styles.App_Container}>
      <Navbar>
        <button
          className={styles.Button}
          onClick={() => {
            ChangePage(-1);
          }}
          disabled={pageIndex <= 0}
        >
          {"PREV"}
        </button>
        <p className={styles.Tutorial_Index}>
          {pageIndex + 1}/{tutorials.length}
        </p>
        <button
          className={styles.Button + " " + styles.Tutorial_Toggle}
          onClick={toggleModal}
        >
          {isModalVisible ? "HIDE" : "SHOW"}
        </button>
        <button
          className={styles.Button}
          onClick={() => {
            ChangePage(1);
          }}
          disabled={!enableNext || pageIndex >= tutorials.length - 1}
        >
          {"NEXT"}
        </button>
      </Navbar>

      <Panel className={styles.App}>
        <HintPanel lessons={tutorials} pageIndex={pageIndex}></HintPanel>

        <Modal visible={isModalVisible}>
          <Panel className={styles.Tutorial}>
            <TutorialPanel tutorialObject={page} />
          </Panel>
        </Modal>

        <Panel className={styles.Editor}>
          <CodeEditor
            value={solutionVisible ? solution : code}
            language="python"
            placeholder="Please enter Python code."
            onChange={(e) =>
              !solutionVisible ? setCode(e.target.value) : () => {}
            }
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
            <button
              id="ide-reset"
              className={styles.Button}
              onClick={ResetCode}
            >
              RESET
            </button>
            {solutionAvailable && (
              <button
                id="ide-solution"
                className={styles.Button}
                onClick={ShowSolution}
              >
                SOLUTION
              </button>
            )}
          </div>

          {/* stderr console. */}
          {err && (
            <pre id="console" className={styles.Error}>
              {stderr || err}
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
