import { useState, useEffect } from "react";
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
const UpdateSongPage = () => {
  const [title, setTitle] = useState("");
  const [linesTamil, setLinesTamil] = useState([{ chordLine: "", lyricLine: "" }]);
  const [linesTanglish, setLinesTanglish] = useState([{ chordLine: "", lyricLine: "" }]);
  const [songs, setSongs] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);

  useEffect(() => {
    api.get("api/songs").then((res) => setSongs(res.data));
  }, []);

  const handleLineChange = (type, index, field, value) => {
    const lines = type === "tamil" ? [...linesTamil] : [...linesTanglish];
    lines[index][field] = value;
    type === "tamil" ? setLinesTamil(lines) : setLinesTanglish(lines);
  };

  const addLine = (type) => {
    const newLine = { chordLine: "", lyricLine: "" };
    type === "tamil" ? setLinesTamil([...linesTamil, newLine]) : setLinesTanglish([...linesTanglish, newLine]);
  };

  const removeLine = (type, index) => {
    const updated = (type === "tamil" ? linesTamil : linesTanglish).filter((_, i) => i !== index);
    type === "tamil" ? setLinesTamil(updated) : setLinesTanglish(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const songData = { title, linesTamil, linesTanglish };
    try {
      if (selectedSongId) {
        await api.put(`api/songs/${selectedSongId}`, songData);
        alert("Song updated successfully!");
      } else {
        await api.post("api/songs", songData);
        alert("Song saved successfully!");
      }
      setTitle("");
      setLinesTamil([{ chordLine: "", lyricLine: "" }]);
      setLinesTanglish([{ chordLine: "", lyricLine: "" }]);
      setSelectedSongId(null);
      const res = await api.get("api/songs");
      setSongs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to save/update song");
    }
  };

  const handleSongSelect = (id) => {
    const song = songs.find((s) => s.id === parseInt(id));
    if (song) {
      setSelectedSongId(song.id);
      setTitle(song.title);
      setLinesTamil(song.linesTamil.length ? song.linesTamil : [{ chordLine: "", lyricLine: "" }]);
      setLinesTanglish(song.linesTanglish.length ? song.linesTanglish : [{ chordLine: "", lyricLine: "" }]);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <h2>{selectedSongId ? "Update Song" : "Add New Song"}</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Select Existing Song to Edit:</label>
        <select onChange={(e) => handleSongSelect(e.target.value)} value={selectedSongId || ""}>
          <option value="">-- New Song --</option>
          {songs.map((song) => (
            <option key={song.id} value={song.id}>{song.title}</option>
          ))}
        </select>
      </div>

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

        <h4>Tamil Lyrics and Chords</h4>
        {linesTamil.map((line, index) => (
          <div key={`tamil-${index}`} style={{ marginBottom: "12px" }}>
            <textarea
              placeholder="Chord line"
              value={line.chordLine}
              onChange={(e) => handleLineChange("tamil", index, "chordLine", e.target.value)}
              rows={1}
              style={{ width: "100%", fontFamily: "monospace", marginBottom: "4px" }}
              required
            />
            <textarea
              placeholder="Lyric line in Tamil"
              value={line.lyricLine}
              onChange={(e) => handleLineChange("tamil", index, "lyricLine", e.target.value)}
              rows={1}
              style={{ width: "100%", fontFamily: "monospace" }}
              required
            />
            {linesTamil.length > 1 && (
              <button type="button" onClick={() => removeLine("tamil", index)} style={{ marginTop: "4px" }}>
                Remove Line
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addLine("tamil")} style={{ marginBottom: "16px" }}>+ Add Tamil Line</button>

        <h4>Tanglish Lyrics and Chords</h4>
        {linesTanglish.map((line, index) => (
          <div key={`tanglish-${index}`} style={{ marginBottom: "12px" }}>
            <textarea
              placeholder="Chord line"
              value={line.chordLine}
              onChange={(e) => handleLineChange("tanglish", index, "chordLine", e.target.value)}
              rows={1}
              style={{ width: "100%", fontFamily: "monospace", marginBottom: "4px" }}
              required
            />
            <textarea
              placeholder="Lyric line in Tanglish"
              value={line.lyricLine}
              onChange={(e) => handleLineChange("tanglish", index, "lyricLine", e.target.value)}
              rows={1}
              style={{ width: "100%", fontFamily: "monospace" }}
              required
            />
            {linesTanglish.length > 1 && (
              <button type="button" onClick={() => removeLine("tanglish", index)} style={{ marginTop: "4px" }}>
                Remove Line
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addLine("tanglish")} style={{ marginBottom: "16px" }}>+ Add Tanglish Line</button>

        <br />
        <button type="submit">{selectedSongId ? "Update Song" : "Save Song"}</button>
      </form>
    </div>
  );
};

export default UpdateSongPage;
