import React from "react";
import "../styles/Sidebar.css";

function Sidebar({
  chats,
  currentChat,
  setCurrentChat,
  newChat,
  deleteChat,
  sidebarOpen,
  setSidebarOpen
}) {

  return (
    <>

      {/* Toggle Button */}
      <button
        className="menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>


      <div className={`sidebar ${sidebarOpen ? "open" : "close"}`}>

        <button className="new-chat" onClick={newChat}>
          ➕ New Chat
        </button>


        <h2>Chat History</h2>


        <div className="chat-list">

          {chats.map((chat, index) => (

            <div
              key={chat.id}
              className={
                currentChat === index
                  ? "chat-item active"
                  : "chat-item"
              }
            >

              <span
                onClick={() => setCurrentChat(index)}
              >
                {chat.title}
              </span>


              <button
                onClick={() => deleteChat(chat.id)}
              >
                🗑️
              </button>

            </div>

          ))}

        </div>

      </div>

    </>
  );
}


export default Sidebar;