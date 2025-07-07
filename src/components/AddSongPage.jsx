import React, { useState } from "react";
import axios from "axios";

const AddSongPage = () => {
  const [title, setTitle] = useState("");
  const [linesTamil, setLinesTamil] = useState([""]);
  const [linesTanglish, setLinesTanglish] = useState([""]);
  const [message, setMessage] = useState("");

  const handleLineChange = (setter, index, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addLine = (setter) => {
    setter((prev) => [...prev, ""]);
  };

  const removeLine = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const song = {
      title,
      linesTamil: linesTamil.map(line => ({ chord: "", line })),
      linesTanglish: linesTanglish.map(line => ({ chord: "", line }))
    };

    try {
      await axios.post("http://localhost:8080/api/songs", song);
      setMessage("✅ Song added successfully!");
      setTitle("");
      setLinesTamil([""]);
      setLinesTanglish([""]);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add song.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "1rem" }}>
      <h2>Add New Song</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "1rem" }}
          />
        </div>

        <div>
          <label>Tamil Lines:</label>
          {linesTamil.map((line, index) => (
            <div key={index} style={{ marginBottom: "0.5rem" }}>
              <input
                type="text"
                value={line}
                onChange={(e) => handleLineChange(setLinesTamil, index, e.target.value)}
                style={{ width: "90%" }}
              />
              {linesTamil.length > 1 && (
                <button type="button" onClick={() => removeLine(setLinesTamil, index)}>
                  ❌
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addLine(setLinesTamil)}>➕ Add Line</button>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>Tanglish Lines:</label>
          {linesTanglish.map((line, index) => (
            <div key={index} style={{ marginBottom: "0.5rem" }}>
              <input
                type="text"
                value={line}
                onChange={(e) => handleLineChange(setLinesTanglish, index, e.target.value)}
                style={{ width: "90%" }}
              />
              {linesTanglish.length > 1 && (
                <button type="button" onClick={() => removeLine(setLinesTanglish, index)}>
                  ❌
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addLine(setLinesTanglish)}>➕ Add Line</button>
        </div>

        <button type="submit" style={{ marginTop: "1.5rem" }}>Submit</button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", color: message.includes("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AddSongPage;
