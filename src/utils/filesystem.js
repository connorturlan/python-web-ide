export const readFile = async (filename) => {
  const req = await fetch(filename);
  return await req.text();
};

export const loadFile = async (hook, filename) => {
  return hook(filename, await readFile(filename), { encoding: "utf-8" });
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
