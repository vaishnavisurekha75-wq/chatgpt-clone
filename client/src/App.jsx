import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import Typing from "./components/Typing";

import "./App.css";

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef(null);

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("all-chats");

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: Date.now(),
            title: "New Chat",
            messages: [
              {
                sender: "bot",
                text: "👋 Hello! I'm your AI Assistant. How can I help you today?",
              },
            ],
          },
        ];
  });

  const [currentChatId, setCurrentChatId] = useState(chats[0].id);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("all-chats", JSON.stringify(chats));
  }, [chats]);

  const currentChat =
    chats.find((chat) => chat.id === currentChatId) || chats[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [currentChat.messages, loading]);

  const sendMessage = async (message) => {

    if (!message.trim()) return;

    const chatTitle =
      message.length > 35
        ? message.substring(0, 35) + "..."
        : message;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              title:
                chat.title === "New Chat"
                  ? chatTitle
                  : chat.title,
              messages: [...chat.messages, userMessage],
            }
          : chat
      )
    );

    setLoading(true);

    try {

      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await res.json();

      const botMessage = {
        sender: "bot",
        text: "",
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, botMessage],
              }
            : chat
        )
      );

      let currentText = "";
            for (let i = 0; i < data.reply.length; i++) {

        currentText += data.reply[i];

        await new Promise((resolve) =>
          setTimeout(resolve, 5)
        );

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg, index) =>
                    index === chat.messages.length - 1
                      ? {
                          ...msg,
                          text: currentText,
                        }
                      : msg
                  ),
                }
              : chat
          )
        );

      }

    } catch {

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    sender: "bot",
                    text: "❌ Server Error",
                  },
                ],
              }
            : chat
        )
      );

    }

    setLoading(false);

  };

  const newChat = () => {

    const chat = {
      id: Date.now(),
      title: "New Chat",
      messages: [
        {
          sender: "bot",
          text: "👋 Hello! I'm your AI Assistant. How can I help you today?",
        },
      ],
    };

    setChats((prev) => [chat, ...prev]);
    setCurrentChatId(chat.id);

  };

  const deleteChat = (id) => {

    const updatedChats = chats.filter(
      (chat) => chat.id !== id
    );

    if (updatedChats.length === 0) {

      const newChatData = {
        id: Date.now(),
        title: "New Chat",
        messages: [
          {
            sender: "bot",
            text: "👋 Hello! I'm your AI Assistant. How can I help you today?",
          },
        ],
      };

      setChats([newChatData]);
      setCurrentChatId(newChatData.id);
      return;
    }

    setChats(updatedChats);

    if (
      !updatedChats.some(
        (chat) => chat.id === currentChatId
      )
    ) {
      setCurrentChatId(updatedChats[0].id);
    }
  };
    return (
    <div className="app">

      <Sidebar
        chats={chats}
        currentChat={chats.findIndex(
          (chat) => chat.id === currentChatId
        )}
        setCurrentChat={(index) =>
          setCurrentChatId(chats[index].id)
        }
        newChat={newChat}
        deleteChat={deleteChat}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="chat-area">

        <div className="messages">

          {currentChat.messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg}
            />
          ))}

          {loading && (
            <div className="typing-container">
              <Typing />
            </div>
          )}

          <div ref={messagesEndRef}></div>

        </div>

        <ChatInput sendMessage={sendMessage} />

      </div>

    </div>
  );
}

export default App;