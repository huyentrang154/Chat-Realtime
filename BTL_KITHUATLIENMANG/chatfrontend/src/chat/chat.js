import "./chat.scss";
import { to_Decrypt, to_Encrypt,readFileAndCrypt } from "../ProcessEncrypt.js";
import { encryptAESCBC,decryptAESCBC } from "../AESCBC.js";
import { process } from "../store/action/index";
import { key } from "../store/action/index";
import React, { useState, useEffect, useRef, useCallback} from "react";
import { useDispatch,useSelector } from "react-redux";
import { AiFillCamera, AiFillFile,AiOutlineCloudDownload } from "react-icons/ai";
import { useDropzone } from "react-dropzone";
import CloseButton from "../image/CloseButton.png";
import Avartar1 from "../image/HuyenTrang.jpg";
import Avartar2 from "../image/flower.png";
//
var CryptoJS = require("crypto-js");

function Chat({ username, roomname,avartar, socket }) {
  const time = new Date();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const [secret_key, setsecret_key] = useState("uI2ooxtwHeI6q69PS98fx9SWVGbpQohO")
  const [fileMedia, setFileMedia] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  //const [secretkey, setsecretKey] = useState("uI2ooxtwHeI6q69PS98fx9SWVGbpQohO")
  const state = useSelector((state) => state.KeyReducer);
  console.log(secret_key,"trang")
  const styleUploadImage = {
    position: "relative"
  }
  const styleUploadWrapper = {
    flexWrap: "wrap",
    backgroundColor: "#E6E9F1",
    border: "1px solid #F6F6F6",
    borderRadius: "8px",
    padding: "10px 20px 5px 20px",
    width: "50%",
    margin: "0px 0px 5px"
  }
  const styleSendImage = {
    flexWrap: "wrap",
    backgroundColor: "#E6E9F1",
    border: "1px solid #F6F6F6",
    borderRadius: "8px",
    padding: "10px 20px 5px 20px",
    width: "50%",
    margin: "0px 0px 7px 53px"
  }
  const styleSendImageright = {
    flexWrap: "wrap",
    backgroundColor: "#E6E9F1",
    border: "1px solid #F6F6F6",
    borderRadius: "8px",
    padding: "10px 20px 5px 20px",
    width: "50%",
    margin: "0px 0px 7px 176px"
  }
  
  const styleCloseButton = {
    cursor: "pointer",
    position: "absolute",
    top: "-5px",
    right: "-5px"
  }
  const arrayBufferToFile = (buffer, filename) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    return new File([blob], filename, { type: 'application/octet-stream' });
  };
  const FiletoBlob = (file) =>{
      new Blob([new Uint8Array(file.arrayBuffer())],{type: file.type});
  }
  const dispatchKey = (text) => {
    dispatch(key(text));
  };
  const dispatchProcess = (encrypt, msg, cipher) => {
    dispatch(process(encrypt, msg, cipher));
  };
  const to_Decrypt = (data) => {
    if (data.key) {
      dispatchKey(data.key)
      console.log(state.key,"key client")
      return;
    }
    if (data.text.text.startsWith("Welcome")) {
      dispatchProcess(false, data.text, data.text);
      let temp = messages;
      temp.push({
        userId: data.userId,
        username: data.username,
        text: {...data.text},
      });
      setMessages([...temp]);
      return;
    }
    else if (data.username === "userJoin") {
      dispatchProcess(false, data.text, data.text);
      let temp = messages;
      temp.push({
        userId: data.userId,
        username: data.username,
        text: {...data.text},
      });
      setMessages([...temp]);
      return;
    }
    else{
      console.log(secret_key,"dec")
      console.log(data.text,"dec1")
      var cipher = data.text;
      var bytes = CryptoJS.AES.decrypt(cipher.text, secret_key);
      console.log(bytes,"dec2")
      var decrypted_text = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      console.log(decrypted_text,"dec3")
      if(cipher.file){
        var file = arrayBufferToFile(cipher.file,cipher.filename)
        const reader = new FileReader()
        reader.onload = (e) => {
          const text = (e.target.result)
          //dispatchProcess(false, text, text);
          var bytes= CryptoJS.AES.decrypt(text, secret_key);
          var decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          //alert(decrypted)
          var data_file = [];
          data_file.push(decrypted);
          var properties = {type: 'text/plain'};
          var file_decrypted = new File(data_file, file.name, properties);
          const content = {
            text: decrypted_text,
            file: file_decrypted,
            time:cipher.time
          }
          const content_text = {
            text: decrypted_text,
            file: decrypted,
          }
          const content_decrypted = {
            text: data.text.text,
            file: text,
          }
          dispatchProcess(false, content_text, content_decrypted);
          let temp = messages;
        temp.push({
          userId: data.userId,
          username: data.username,
          text: {...content},
        });
        setMessages([...temp]);
        };
        reader.readAsText(file)
      }
      else{
        const content = {
          text: decrypted_text,
          file: null,
          time:cipher.time
        }
        dispatchProcess(false, content, cipher);
        let temp = messages;
        temp.push({
          userId: data.userId,
          username: data.username,
          text: {...content},
        });
        setMessages([...temp]);
      }
    }
    
  };
  useEffect(()=>{
    setsecret_key(state.key);
  },[dispatch])
  useEffect(() => {
    var test = encryptAESCBC("Lien minh chau au, toi biet toi khong phai nguoi tot, khong sao ca chi can co toi moi chuyen se on","uI2ooxtwHeI6q69PS98fx9SWVGbpQohO");
    //console.log(encryptAESCBC("trang","uI2ooxtwHeI6q69PS98fx9SWVGbpQohO"),"trang")
    //console.log(decryptAESCBC(test,"uI2ooxtwHeI6q69PS98fx9SWVGbpQohO"))
    console.log(state.key)
    socket.on("message", (data) => {
      //decypt
      console.log(data,"alo");
      if(data){
        to_Decrypt(data);
      }
      
      
    });
  }, [socket]);
  const onDrop = useCallback(acceptedFiles => {
    setIsUploading(() => true);
    setFileMedia(acceptedFiles[0]);
    console.log(acceptedFiles[0],"t")
    //console.log(fileMedia,"test")
    // const reader = new FileReader()
    // reader.onload = async (e) => {
    //   const text = (e.target.result)
    //   //dispatchProcess(false, text, text);
    //   console.log(text)
    //   alert(text)
    // };
    // reader.readAsText(acceptedFiles[0])
   setIsUploading(() => false);
  }, [setFileMedia])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  const sendData =() => {
    if (text !== "") {
      const content = {
        "text": text,
        "file": fileMedia,
      }
    dispatchKey(secret_key)
    to_Encrypt(content,secret_key,socket);
    setText("");
    setFileMedia(null);
  };
}
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  console.log(messages, "mess");
  let iconStyles = { color: "black" };
  return (
    <div className="chat">
      <div className="user-name">
        {avartar==="1"?
          <img

          src={Avartar1} alt="channel"
          style={{ width: "32px", height: "32px", borderRadius: "50%", margin: "0 10px 0 0", objectFit: "cover" }}
        //onClick={() => { OnClickOpennewToken(index, item._id) }}
        />:
        <img

          src={Avartar2} alt="channel"
          style={{ width: "32px", height: "32px", borderRadius: "50%", margin: "0 10px 0 0", objectFit: "cover" }}
        //onClick={() => { OnClickOpennewToken(index, item._id) }}
        />}
        <h2>
          {username} <span style={{ fontSize: "0.7rem" }}>in {roomname}</span>
        </h2>
      </div>
      <div className="chat-message">
        {messages.map((i) => {
          if (i.username !== username) {
            return (
              <>
              {
                i.text.file &&
                <div className="nk-reply-form" style={styleSendImage}>
                  
                <div style={styleUploadImage}>
                  <AiFillFile style={iconStyles} />
                  {/* <img src={`${URL.createObjectURL(fileMedia)}`} style={{ width: "50px", height: "50px" }} alt="media" /> */}
                  <span>{i.text.file.name}</span>
                  
                    <a href={window.URL.createObjectURL(i.text.file)} download><AiOutlineCloudDownload style={iconStyles}/></a>
                  
                </div>
              </div>
              }
              <div className="message">
              {i.username==="userJoin"?
                 <h6>{i.text.text}</h6>
                 :
                 <>
                 {
                  i.username !== "Server Bob" &&
                  <>
                  {avartar==="1"?
                    <img
          
                    src={Avartar2} alt="channel"
                    style={{ width: "32px", height: "32px", borderRadius: "50%", margin: "0 10px 0 0", objectFit: "cover" }}
                  //onClick={() => { OnClickOpennewToken(index, item._id) }}
                  />:
                  <img
          
                    src={Avartar1} alt="channel"
                    style={{ width: "32px", height: "32px", borderRadius: "50%", margin: "0 10px 0 0", objectFit: "cover" }}
                  //onClick={() => { OnClickOpennewToken(index, item._id) }}
                  />}
                </>
          }
                <div>
                  <p>{i.text.text}</p>
                  <span>{i.username} {i.text.time}</span>
                </div>
                
                 </>
              }
              </div>
              </>
            );
          } else {
            return (
              <>
              {
                i.text.file &&
                <div className="nk-reply-form" style={styleSendImageright}>
                  
                <div style={styleUploadImage}>
                  <AiFillFile style={iconStyles} />
                  {/* <img src={`${URL.createObjectURL(fileMedia)}`} style={{ width: "50px", height: "50px" }} alt="media" /> */}
                  <span>{i.text.file.name}</span>
                  <a href={window.URL.createObjectURL(i.text.file)} download><AiOutlineCloudDownload style={iconStyles}/></a>
                </div>
              </div>
              }
              <div className="message mess-right">
                <p>{i.text.text} </p>
                <span>{i.text.time}</span>
              </div>
              </>
            );
          }
        })}
        <div ref={messagesEndRef} />
      </div>
      {
        !isUploading ?
          <>
            {
              fileMedia &&
              <div className="nk-reply-form mb-0" style={styleUploadWrapper}>
                <div style={styleUploadImage}>
                  <AiFillFile style={iconStyles} />
                  {/* <img src={`${URL.createObjectURL(fileMedia)}`} style={{ width: "50px", height: "50px" }} alt="media" /> */}
                  <span>{fileMedia.name}</span>
                  <img src={CloseButton} style={styleCloseButton} onClick={() => setFileMedia(null)} alt="Close" />
                </div>
              </div>
            }
          </>
          :
          <div className="d-flex nk-reply-form mb-0" style={styleUploadWrapper}>
            <div style={{ margin: "auto" }}>
              {/* <Spinner color="dark" /> <span style={{ verticalAlign: "super" }}>Loading...</span> */}
            </div>
          </div>
      }
      <div className="send">
        {/* <img src={camera} alt=""></img> */}
        <div className="icon" {...getRootProps()}>
          <input {...getInputProps()} />
          <AiFillCamera />
        </div>
        <input
          placeholder="enter your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              sendData();
            }
          }}
        ></input>
        <span>
          <i class='fas fa-search'></i>
        </span>
        <button onClick={sendData}>Send</button>
      </div>
    </div>
  );
}
export default Chat;
