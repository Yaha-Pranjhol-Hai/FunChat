import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(""); // Default to empty string
  const socket = useRef(null);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/rooms", { withCredentials: true });
      const json = response.data;
      if (json.success) {
        setRooms(json.rooms);
      } else {
        console.error("Failed to fetch rooms", json.error);
      }
    } catch (error) {
      console.error("Failed to fetch rooms", error.response ? error.response.data : error.message);
    }
  };

  const fetchInitialChats = useCallback(async () => {
    if (selectedRoomId) {
      try {
        const response = await axios.get(`http://localhost:3001/api/chat/room/${selectedRoomId}`, { withCredentials: true });
        const json = response.data;
        if (json.success) {
          setChats(json.messages);
        } else {
          console.error("Failed to fetch chats", json.error);
        }
      } catch (error) {
        console.error("Failed chats error", error.response ? error.response.data : error.message);
      }
    }
  }, [selectedRoomId]);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoomId && socket.current) {
      socket.current.emit('joinRoom', { roomId: selectedRoomId });

      socket.current.on('roomJoined', (response) => {
        if (!response.success) {
          console.error('Failed to join room', response.error);
        }
      });

      fetchInitialChats();
    }
  }, [selectedRoomId, fetchInitialChats]);

  const sendMessage = (message) => {
    if (socket.current) {
      socket.current.emit('sendMessage', { message, roomId: selectedRoomId }, (response) => {
        if (!response.success) {
          console.error('Failed to send message', response.error);
        }
      });
    }
  };

  const handleRoomChange = (event) => {
    setSelectedRoomId(event.target.value);
  };

  return (
    <div>
      <h2>Chat Page</h2>
      <select value={selectedRoomId} onChange={handleRoomChange}>
        <option value="">Select a Room</option>
        {rooms.map((room) => (
          <option key={room._id} value={room._id}>{room.name}</option>
        ))}
      </select>
      <div>
        <div>
          {chats.map((chat, index) => (
            <div key={index}>
              <strong>{chat.user.name}</strong>: {chat.message}
            </div>
          ))}
        </div>
        <button onClick={() => sendMessage('Hello World')}>Send Hello World</button>
      </div>
    </div>
  );
}

export default ChatPage;
