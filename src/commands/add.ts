import recursive from "recursive-readdir"
import path from "path"
import fs from "fs"

export const command = 'add <file>';
export const describe = 'Add files';


function ignoreFunc(file, stats) {
    return (stats.isDirectory() && path.basename(file) == ".git") || (stats.isDirectory() && path.basename(file) == "node_modules");
  }


export const handler = (argv) => {
    const projectPath = process.cwd()
    const filePathReceive = argv.file
    if (filePathReceive == ".") {
        // CREATE A VERSION OF ALL THE FILES 
        /*
            1. Create a dict with the name of the file
            2. Verify if the file exists by the name, 
            3. If yes, create a new version,
            5. If not, just append to the folder versions files
            

            ## Version of the whole project, verifying each file
            - Create a index dict with informations about these version like how files name we have 
            - Verifying by the filename, if have a new one or not have, create a new version of the whole project with new files
            - If all the filenames match, starting to comparing the content, if have any difference, create a new version of the whole project with new files


            ## Create a hash to each file based on the name
            - Create a hash to each file based on the name 
            - Compare if have a new hash or deleted a new hash
            - After that, compare contents, if have a new content, create a new version inside the hash folder
            
            Except: Rename File
        */
        recursive(projectPath, [ignoreFunc], function(err, files) {
            

            files.map((path, index) => {
                const origem = path;
                const destino = __dirname.replace("/src/commands", `/.qiq/objects${index}`);

                fs.copyFile(origem, destino, (err) => {
                if (err) {
                    console.error('Erro ao copiar o arquivo:', err);
                } else {
                    console.log(`Arquivo copiado com sucesso! em: ${destino}`);
                }
                });
            })

        })

    }


};
