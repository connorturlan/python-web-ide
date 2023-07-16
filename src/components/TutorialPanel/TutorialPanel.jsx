import styles from "./TutorialPanel.module.scss";

export const TutorialPanel = ({ tutorialObject }) => {
	if (!tutorialObject) return;

	const { title, content } = tutorialObject ?? {
		title: "null",
		content: "null",
	};

	const tutorial = content
		.replaceAll("\n.", "\xFF")
		.split("\n")
		.map((line) => line.replaceAll("\xFF", "\n"));

	return (
		<>
			<h1>{title}</h1>
			{tutorial.map((line, index) => {
				switch (line.at(0)) {
					case "$":
						return <pre key={index}>{line.slice(1)}</pre>;
					case "!":
						return (
							<p className={styles.Test} key={index}>
								{line.slice(1)}
							</p>
						);
					default:
						return <p key={index}>{line}</p>;
				}
			})}
		</>
	);
};

export default TutorialPanel;
