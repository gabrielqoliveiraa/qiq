const fs = require("fs")

const command = 'init';
const describe = 'Start a new repo';

const handler = () => {
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


    fs.mkdir(".qiq/ref", (err) => {
      if(err){
        console.error(`Error to create a ref folder`)
        return
      }

      
      fs.writeFile(".qiq/ref/index.json", JSON.stringify({objects: {}, version: {}}), (err) => {
        if (err) {
          console.error(err);
        }
      });
    })  

    console.log("Repo started!")

  })


};


module.exports = { command, describe, handler };
