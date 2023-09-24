const recursive = require('recursive-readdir');
const {createHash} = require("crypto")
const path = require("path")
const fs = require("fs")

const command = 'add <file>';
const describe = 'Add files';

const hashFunction = (data) => {
    const md5Hash = createHash('md5');
    return md5Hash.update(data).digest("hex");
}

function ignoreFunc(file, stats) {
    return (stats.isDirectory() && path.basename(file) == ".git") || (stats.isDirectory() && path.basename(file) == "node_modules") || (stats.isDirectory() && path.basename(file) == ".qiq");
}


const writeFile = (filePath, data) => {
    fs.writeFileSync(filePath, data, { encoding: "binary" });
}

const transferFile = (origem, objectsPath, versionFilePath) => {
    fs.readFile(origem, (err, data) => {
        if (err) {
            console.error(err);
            return
        }
        const hash = hashFunction(data);
        const subFolder = hash.slice(0, 2);
        const nameHash = hash.slice(2);
        const subFolderPath = `${objectsPath}/${subFolder}`;

        const isExistsSubFolder = fs.existsSync(subFolderPath);
        if (isExistsSubFolder === true) {
            writeFile(`${subFolderPath}/${nameHash}`, data);
        } else {
            fs.mkdirSync(subFolderPath);
            writeFile(`${subFolderPath}/${nameHash}`, data);
        }
    });
}

const updateJsonObject = (filePath, hash) => {
    const refPath = `${process.cwd()}/.qiq/ref/index.json`;
    const refData = fs.readFileSync(refPath, "utf8");
    const jsonData = JSON.parse(refData);

    if (!jsonData.objects[filePath] || jsonData.objects[filePath] !== hash) {
        jsonData.objects[filePath] = hash;
        fs.writeFileSync(refPath, JSON.stringify(jsonData));
    }
}

const insertNewFile = (filePathReceive, projectPath) => {
    const path = `${projectPath}/${filePathReceive}`;
    const destinyPath = `${process.cwd()}/.qiq/objects`;
    const objectsPath = `${destinyPath}`;

    const filesListFromDestinyPath = fs.readdirSync(destinyPath);

    fs.readFile(path, (err, data) => {
        if (err) {
            console.error(err);
            return
        }
        const hash = hashFunction(data);
        const subFolder = hash.slice(0, 2);
        const nameHash = hash.slice(2);
        const versionFilePath = `${objectsPath}/${subFolder}/${nameHash}`;

        const thereIsObjectInThisSubPath = fs.existsSync(versionFilePath);

        if ((filesListFromDestinyPath.includes(subFolder)) && thereIsObjectInThisSubPath) {
            const currentFile = fs.readFileSync(path);
            const versionFile = fs.readFileSync(versionFilePath);
            const isEquals = currentFile.equals(versionFile);
            if (!isEquals) {
                transferFile(path, objectsPath, versionFilePath);
                updateJsonObject(filePathReceive, hash); 
            }
        } else {
            updateJsonObject(filePathReceive, hash);
            transferFile(path, objectsPath, versionFilePath);
        }
    });
}

const handler = (argv) => {
    const projectPath = process.cwd();
    const filePathReceive = argv.file;
    if (filePathReceive == ".") {
        recursive(projectPath, [ignoreFunc], function (err, files) {
            files.map((path) => {
                const fileName = path.replace(`${projectPath}/`, "");
                insertNewFile(fileName, projectPath);
            })
        })
    } else {
        insertNewFile(filePathReceive, projectPath);
    }
};


module.exports = { command, describe, handler };
