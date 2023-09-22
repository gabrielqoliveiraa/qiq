import fs from "fs"

export const command = 'init';
export const describe = 'Start a new repo';

export const handler = () => {
  fs.mkdir(".qiq", (err) => {
    if(err){
      console.error(`Repo already created in ${__dirname.replace("/src/commands", "/.qiq/")}`)
      return
    }

    fs.mkdir(".qiq/commits", (err) => {
      if(err){
        console.error(`Error to create a commits folder`)
        return
      }
    })

    fs.mkdir(".qiq/objects", (err) => {
      if(err){
        console.error(`Error to create a objects folder`)
        return
      }
    })

    console.log("Repo started!")

  })


};
