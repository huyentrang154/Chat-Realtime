//var aes256 = require("aes256");
import { encryptAESCBC,decryptAESCBC } from "./AESCBC.js";
var CryptoJS = require("crypto-js");
const arrayBufferToFile = (buffer, filename) => {
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  return new File([blob], filename, { type: 'application/octet-stream' });
};
export const to_Encrypt = (content,secret_key,socket) => {
  const t = new Date();
  const time = t.getHours()+":"+t.getMinutes();
  console.log(secret_key)
  var Text = CryptoJS.AES.encrypt(JSON.stringify(content.text), secret_key).toString();
  if(content.file){
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result)
      var encrypted= CryptoJS.AES.encrypt(JSON.stringify(text), secret_key).toString();
      alert(encrypted)
      var data = [];
      data.push(encrypted);
      var properties = {type: 'text/plain'};
      var file = new File(data, content.file.name, properties);
      
      const Content = {
        "text": Text,
        "file": file,
        "filename":file.name,
        "time":time
      }
      socket.emit("chat", Content);
    };
    reader.readAsText(content.file)
  }
  else{
    const Content = {
      "text": Text,
      "file": null,
      "time":time
    }
    socket.emit("chat", Content);
  }
   
};
export const readFileAndCrypt = (file)=>{
  return new Promise((resolve,reject) => {
      //let cipher = crypto.createCipher(algorithm,key);
      // fs.readFile(file, (err,data) => {
      //     let dataBuffer = Buffer.from(data,'hex')
      //     var encrypted=CryptoJS.AES.encrypt(JSON.stringify(dataBuffer), secret_key).toString();
      //     fs.writeFile(`${file}.crypt`,encrypted,() => {
      //         fs.unlink(file,(err)=>{
      //             if(err) reject(err)
      //         })
      //         resolve(`${file} crypted.`)
      //     })
      })
  //});
}