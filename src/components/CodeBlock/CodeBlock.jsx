import styles from "./CodeBlock.module.scss";

function CodeBlock({ code, value }) {
  return (
    <div>
      <pre>{code}</pre>
    </div>
  );
}

export default CodeBlock;
