import React, { useState , CSSProperties } from "react";
import "./home.scss";
import { Link } from "react-router-dom";
import Select from 'react-select'
import style from "./home.scss";

function Homepage({ socket }) {
  const [username, setusername] = useState("");
  const [roomname, setroomname] = useState("");
  const [avartar, setavartar] = useState("1");
  const options = [
    { value: '1', label: 'Chocolate' },
    { value: '2', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]
  const t = new Date();
  const time = t.getHours()+":"+t.getMinutes();
  const sendData = () => {
    if (username !== "" && roomname !== "") {
      socket.emit("joinRoom", { username, roomname, time });
    } else {
      alert("username and roomname are must !");
      window.location.reload();
    }
  };

  return (
    <div className="homepage">
      <h1>Welcome to ChatApp</h1>
      <input
        placeholder="Input your user name"
        value={username}
        onChange={(e) => setusername(e.target.value)}
      ></input>
      <input
        placeholder="Input the room name"
        value={roomname}
        onChange={(e) => setroomname(e.target.value)}
      ></input>
      <select value={avartar} onChange={(e) => setavartar(e.target.value)}
      >
      <option onClick={()=>setavartar("1")} >Avartar People</option>
  <option onClick={()=>setavartar("2")} >Avartar Fllower</option>
  </select>
      <Link to={`/chat/${roomname}/${username}/${avartar}`}>
        <button onClick={sendData}>Join</button>
      </Link>
    </div>
  );
}

export default Homepage;
