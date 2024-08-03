import React, { useState } from "react";
import axios from "axios";

const RegistrationForm = () => {
  const [roomName, setRoomName] = useState("");
  const [inviteEmails, setInviteEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRoomChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleInviteEmailChange = (e) => {
    setInviteEmails(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3001/api/rooms/createroom", {
        roomName,
        inviteEmails: inviteEmails.split(",").map(email => email.trim()),
      }, { withCredentials: true });

      if (response.data.success) {
        alert("Room created and invites sent successfully.");
        setRoomName("");
        setInviteEmails(""); // They both clear the form so that if the user may want to create a new room.
      } else {
        setError("Failed to create room or send invites.");
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "50%", margin: "auto", padding: "1rem" }}>
      <h2>Create Room and Send Invites</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="roomName" className="form-label">
            Room Name
          </label>
          <input
            value={roomName}
            onChange={handleRoomChange}
            type="text"
            id="roomName"
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inviteEmails" className="form-label">
            Invite Emails (Comma Separated)
          </label>
          <input
            type="text"
            id="inviteEmails"
            className="form-control"
            value={inviteEmails}
            onChange={handleInviteEmailChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Sending..." : "Send Invites"}
        </button>
        {error && <div className="alert alert-danger">{error}</div>}
      </form>
    </div>
  );
};

export default RegistrationForm;
