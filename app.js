const fs = require('fs/promises');

(async () => {

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

  const CREATE_FILE = "create a file";

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
  })

  const watcher = fs.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
