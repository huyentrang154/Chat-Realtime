import { useState,useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { key } from "../store/action/index";
import "./process.scss";
function Process({socket}) {
  const dispatch = useDispatch();
  const [test, setT] = useState("uI2ooxtwHeI6q69PS98fx9SWVGbpQohO");
  const state = useSelector((state) => state.ProcessReducer);
  const dispatchKey = (text) => {
    dispatch(key(text));
  };
  const ChangeKey = (key) => {
    if(key.length===32||key.length===16||key.length===24){
      socket.emit("SecureKey", key);
    }
    else alert("Khóa của bạn phải có độ dài 16, 24 or 32 bytes!");
    
  }
  useEffect(() => {
    socket.on("message", (data) => {
      //decypt
      console.log(data,"alo");
        if (data.key) { 
          setT(data.key)
          console.log(test,"process")
          return;
        }
      
      
      
    });
  }, [socket]);
  return (
    <div className="process">
      <h3 className="tittle">ENCRYPT IN CHAT</h3>
      {/* <h5>
        Secret Key : <span>"uI2ooxtwHeI6q69PS98fx9SWVGbpQohO"</span>
      </h5> */}
      <div className="flex">
      <input
          style={{ color: "black",
            padding: "5px",
            width: "279px",
            margin: "0px 60px 20px 13px" }}
          placeholder="enter change key"
          value={test}
          onChange={(e)=>{

            console.log(e.target.value,"process")
            setT(e.target.value)
            //dispatchProcess(e.target.value)
          }}
        ></input>
      <button 
      style={{
        padding: "7px 17px",
        backgroundColor: "#db1212",
        borderRadius: "5px",
        cursor:"pointer"
        }} onClick={()=>{ChangeKey(test)}}>Đổi</button>
      </div>
      <div className="incoming">
        <h4>Incoming Data</h4>
        {state.cypher && 
        <textarea
        value={"Text: "+state.cypher.text+"\nFile: "+state.cypher.file}
        //onChange={this.handleChange}
        rows={5}
        />
      }
      </div>
      <div className="crypt">
        <h4>Decypted Data</h4>
        {state.text && 
           <textarea
           value={"Text: "+state.text.text+"\nFile: "+state.text.file}
           //onChange={this.handleChange}
           rows={5}
           />
        }
      </div>
    </div>
  );
}
export default Process;
