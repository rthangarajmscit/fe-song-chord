import { useState } from "react";
import jsPDF from "jspdf";
import axios from "../services/api";

export default function SongEditor({ user }) {
  const [title, setTitle] = useState("");
  const [lines, setLines] = useState([{ chordLine: "", lyricLine: "" }]);

  const handleAddLine = () => {
    setLines([...lines, { chordLine: "", lyricLine: "" }]);
  };

  const handleLineChange = (index, field, value) => {
    const updated = [...lines];
    updated[index][field] = value;
    setLines(updated);
  };

  const handleSubmit = async () => {
    await axios.post("/songs", { title, userId: user.id, lines });
    alert("Song saved!");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    lines.forEach((line, i) => {
      doc.text(line.chordLine, 10, 20 + i * 12);
      doc.text(line.lyricLine, 10, 26 + i * 12);
    });
    doc.save(`${title}.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Add New Song</h1>
      <input
        className="border p-2 mb-4 w-full"
        placeholder="Song Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {lines.map((line, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            className="flex-1 border p-1"
            placeholder="Chord Line"
            value={line.chordLine}
            onChange={(e) => handleLineChange(idx, "chordLine", e.target.value)}
          />
          <input
            className="flex-1 border p-1"
            placeholder="Lyric Line"
            value={line.lyricLine}
            onChange={(e) => handleLineChange(idx, "lyricLine", e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleAddLine} className="bg-blue-500 text-white px-4 py-1 rounded">Add Line</button>
      <div className="mt-4 flex gap-4">
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-1 rounded">Save Song</button>
        <button onClick={exportToPDF} className="bg-gray-800 text-white px-4 py-1 rounded">Export PDF</button>
      </div>
    </div>
  );
}
