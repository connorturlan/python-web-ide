export const loadFile = async (hook, filename) => {
  const req = await fetch(filename);
  const data = await req.text();
  hook(filename, data, { encoding: "utf-8" });
};

export const loadFiles = (hook, filenames) => {
  filenames.forEach((name) => loadFile(hook, name));
};

export const loadTextFiles = (loadHook) => {
  const files = ["./drseuss.txt", "./thelorax.txt", "./philosophy.txt"];
  loadFiles(loadHook, files);
};

export const loadPyFiles = (loadHook) => {
  const files = ["./src/main.py"];
  loadFiles(loadHook, files);
};
