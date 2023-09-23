import recursive from "recursive-readdir"
import {createHash} from "crypto"
import path from "path"
import fs from "fs"

export const command = 'add <file>';
export const describe = 'Add files';

const hashFunction = (message: string) => {
    const md5Hash = createHash('md5');
    const fullHashText = md5Hash.update(message).digest("hex")
    const subFolder = fullHashText.slice(0,2)
    const nameHash = fullHashText.slice(2)
    return [subFolder, nameHash]
}

const writeFile = (filePath, data) => {
  fs.writeFile(filePath, data, {encoding:'utf8',flag:'w'}, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

const transferFile = (origem: string, objectsPath: string, versionFilePath: string) => {
  fs.readFile(origem, (err, data) => {
    if (err) {
      console.error(err);
      return 
    }
    const isExistsSubFolder = fs.existsSync(objectsPath);
    if(isExistsSubFolder === true) {
      writeFile(versionFilePath, data)
    } else {
      fs.mkdirSync(objectsPath)
      writeFile(versionFilePath, data)
    }
});
}

function ignoreFunc(file, stats) {
    return (stats.isDirectory() && path.basename(file) == ".git") || (stats.isDirectory() && path.basename(file) == "node_modules") || (stats.isDirectory() && path.basename(file) == ".qiq");
}

const insertNewFile = (filePathReceive: string, projectPath: string | null) => {
  const [subFolder, nameHash] = hashFunction(filePathReceive)
  const path = `${projectPath}/${filePathReceive}`  

  const destinyPath = __dirname.replace("/src/commands", `/.qiq/objects`);
  const versionFilePath = `${destinyPath}/${subFolder}/${nameHash}`
  const objectsPath = `${destinyPath}/${subFolder}`

  const filesListFromDestinyPath = fs.readdirSync(destinyPath);
  const thereIsObjectInThisSubPath = fs.existsSync(objectsPath) && fs.readdirSync(objectsPath).includes(nameHash)


  if ((filesListFromDestinyPath.includes(subFolder)) && thereIsObjectInThisSubPath) {
    const currentFile = fs.readFileSync(path)
    const versionFile = fs.readFileSync(versionFilePath)
    const isEquals = currentFile.equals(versionFile)
    if (!isEquals) {
      transferFile(path, objectsPath, versionFilePath)
    }
  } else {
    transferFile(path, objectsPath, versionFilePath)  
  }
}


export const handler = (argv) => {
    const projectPath = process.cwd()
    const filePathReceive = argv.file
    if (filePathReceive == ".") {
        recursive(projectPath, [ignoreFunc], function(err, files) {
            files.map((path: string) => {
              const fileName = path.replace(`${projectPath}/`, "")
              insertNewFile(fileName, projectPath)
            })
        })
    } else {
      insertNewFile(filePathReceive, projectPath)
    }
};
