import { useState } from "react";
import axios from "axios";

const AddSongPage = () => {
  const [title, setTitle] = useState("");
  const [lines, setLines] = useState([{ chordLine: "", lyricLine: "" }]);

  const handleLineChange = (index, field, value) => {
    const updatedLines = [...lines];
    updatedLines[index][field] = value;
    setLines(updatedLines);
  };

  const addLine = () => {
    setLines([...lines, { chordLine: "", lyricLine: "" }]);
  };

  const removeLine = (index) => {
    const updatedLines = lines.filter((_, i) => i !== index);
    setLines(updatedLines);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const songData = { title, lines };
    try {
      await axios.post("http://localhost:8080/api/songs", songData);
      alert("Song saved successfully!");
      setTitle("");
      setLines([{ chordLine: "", lyricLine: "" }]);
    } catch (err) {
      console.error(err);
      alert("Failed to save song");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }} className="center-page">
         <div className="center-container">
      <h2>Add New Song</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Song Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
          />
        </div>

        <h4>Lyrics and Chords</h4>
        {lines.map((line, index) => (
          <div key={index} style={{ marginBottom: "12px" }}>
            <textarea
              placeholder="Chord line (e.g., C    G    Am)"
              value={line.chordLine}
              onChange={(e) => handleLineChange(index, "chordLine", e.target.value)}
              rows={1}
              style={{ width: "100%", fontFamily: "monospace", marginBottom: "4px" }}
              required
            />
            <textarea
              placeholder="Lyric line"
              value={line.lyricLine}
              onChange={(e) => handleLineChange(index, "lyricLine", e.target.value)}
              rows={1}
              style={{ width: "100%", fontFamily: "monospace" }}
              required
            />
            {lines.length > 1 && (
              <button type="button" onClick={() => removeLine(index)} style={{ marginTop: "4px" }}>
                Remove Line
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addLine} style={{ marginBottom: "16px" }}>
          + Add Line
        </button>
        <br />
        <button type="submit">Save Song</button>
      </form>
      </div>
    </div>
  );
};

export default AddSongPage;
