import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const CHORDS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function transposeChord(chord, steps) {
  const match = chord.match(/^([A-G]#?)(m|maj7|m7|sus4|dim|aug|7)?$/i);
  if (!match) return chord;
  const root = match[1];
  const suffix = match[2] || "";
  const index = CHORDS.indexOf(root.toUpperCase());
  if (index === -1) return chord;
  const newIndex = (index + steps + CHORDS.length) % CHORDS.length;
  return CHORDS[newIndex] + suffix;
}

function transposeLine(line, steps) {
  return line.replace(/\b([A-G]#?(m|maj7|m7|sus4|dim|aug|7)?)\b/g, (match) =>
    transposeChord(match, steps)
  );
}

function parseMarkdownLyrics(line) {
  return line.replace(
    /\[([A-G#]+)\]/g,
    (match, chord) => `<span class="chord-inline">${chord}</span>`
  );
}

function SongList() {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [transpose, setTranspose] = useState(0);
  const [showChords, setShowChords] = useState(true);
  const [language, setLanguage] = useState("tamil"); // "tamil" or "tanglish"
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
  axios
    .get("http://localhost:8080/api/songs/first5")
    .then((response) => setSongs(response.data))
    .catch((error) => console.error("Error fetching songs:", error));
}, []);


  useEffect(() => {
    axios
      .get("http://localhost:8080/api/songs")
      .then((response) => setSongs(response.data))
      .catch((error) => console.error("Error fetching songs:", error));
  }, []);

  function exportToPDF(song) {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(song.title, 10, 10);

    const lines = language === "tamil" ? song.linesTamil : song.linesTanglish;
    let y = 20;
    lines.forEach((line) => {
      if (showChords && line.chordLine) {
        doc.text(transposeLine(line.chordLine, transpose), 10, y);
        y += 7;
      }
      doc.text(line.lyricLine, 10, y);
      y += 10;
    });

    doc.save(`${song.title}.pdf`);
  }

  function handleSearch() {
  axios
    .get(`http://localhost:8080/api/songs/search?title=${encodeURIComponent(searchTerm)}`)
    .then((response) => setSongs(response.data))
    .catch((error) => console.error("Error searching songs:", error));
}


  return (
    <div className="center-page">
      <div className="center-container">
        <div className="text-center">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded mr-2"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Search
            </button>
          </div>

          <h1 className="text-2xl font-bold my-4">Song List</h1>

          <ul className="mb-4">
            {songs.map((song) => (
              <li key={song.id}>
                <button
                  className="text-blue-500 underline"
                  onClick={() => setSelectedSong(song)}
                >
                  {song.title}
                </button>
              </li>
            ))}
          </ul>

          {selectedSong && (
            <div className="song-display">
              <h2 className="text-xl font-bold mb-2">{selectedSong.title}</h2>

              <div className="flex justify-center gap-4 mb-3">
                <button onClick={() => setTranspose(transpose + 1)}>
                  Transpose Up
                </button>
                <button onClick={() => setTranspose(transpose - 1)}>
                  Transpose Down
                </button>
                <button onClick={() => setShowChords(!showChords)}>
                  {showChords ? "Hide Chords" : "Show Chords"}
                </button>
                <button
                  onClick={() =>
                    setLanguage(language === "tamil" ? "tanglish" : "tamil")
                  }
                >
                  {language === "tamil" ? "Show Tanglish" : "Show Tamil"}
                </button>
                <button onClick={() => exportToPDF(selectedSong)}>
                  Export PDF
                </button>
                <button onClick={() => window.print()}>Print</button>
              </div>

              <div className="text-left mx-auto w-fit">
                {(language === "tamil"
                  ? selectedSong.linesTamil
                  : selectedSong.linesTanglish
                )?.map((line, index) => (
                  <div key={index} style={{ marginBottom: "4px" }}>
                    {showChords && (
                      <pre style={{ marginBottom: "2px" }}>
                        {transposeLine(line.chordLine || "", transpose)}
                      </pre>
                    )}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: parseMarkdownLyrics(line.lyricLine || ""),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SongList;
