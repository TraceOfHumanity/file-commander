const fs = require('fs/promises');

(async () => {
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to file";

  const createFile = async (filePath) => {
    try {
      const existingFileHandler = await fs.open(filePath, "r");
      existingFileHandler.close();
      return console.log(`The file ${filePath} already exists`);
    } catch (error) {
      const newFileHandler = await fs.open(filePath, "w");
      console.log("A new file was successfully created");
      newFileHandler.close();
    }
  }

  const deleteFile = async (filePath) => {
    console.log(`The file ${filePath} was successfully deleted`);
  }

  const renameFile = async (filePath, newFilePath) => {
    console.log(`The file ${filePath} was successfully renamed to ${newFilePath}`);
  }

  const addToFile = async (filePath, content) => {
    console.log(`The file ${filePath} was successfully updated with the content: ${content}`);
  }

  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    const size = (await commandFileHandler.stat()).size;
    const buffer = Buffer.alloc(size);

    const offset = 0;
    const length = buffer.byteLength;
    const position = 0;

    await commandFileHandler.read(buffer, offset, length, position);

    const command = buffer.toString("utf-8")

    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1)
      createFile(filePath);
    }

    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1)
      deleteFile(filePath);
    }

    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);
      renameFile(oldFilePath, newFilePath);
    }

    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);
      addToFile(filePath, content);
    }
  })

  const watcher = fs.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
