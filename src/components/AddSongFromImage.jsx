import React, { useState } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL,
});

const AddSongFromImage = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setStatus("");
  };

  function groupLinesByY(words, tolerance = 15) {
    const lines = [];

    words.forEach((word) => {
      let found = false;
      for (const line of lines) {
        if (Math.abs(line.y - word.bbox.y0) < tolerance) {
          line.words.push(word);
          found = true;
          break;
        }
      }
      if (!found) {
        lines.push({ y: word.bbox.y0, words: [word] });
      }
    });

    lines.forEach((line) => {
      line.words.sort((a, b) => a.bbox.x0 - b.bbox.x0);
    });

    return lines.sort((a, b) => a.y - b.y);
  }

  function createSpacedLine(words, scaleFactor = 6) {
    if (words.length === 0) return "";

    let line = "";
    let lastX = 0;

    words.forEach((word, index) => {
      const currentX = word.bbox.x0;
      const spaces =
        index === 0
          ? Math.floor(currentX / scaleFactor)
          : Math.floor((currentX - lastX) / scaleFactor);
      line += " ".repeat(Math.max(0, spaces)) + word.text;
      lastX = word.bbox.x1;
    });

    return line.trimEnd();
  }

  const extractTextAndSubmit = async () => {
    if (!image || !title) {
      setStatus("❗ Song title and image are required.");
      return;
    }

    setProcessing(true);
    setStatus("⏳ Extracting Tamil and English text from image...");

    try {
      const imageUrl = URL.createObjectURL(image);

      const [engResult, tamResult] = await Promise.all([
        Tesseract.recognize(imageUrl, "eng", {
          logger: (m) => console.log("ENG OCR:", m),
        }),
        Tesseract.recognize(imageUrl, "tam", {
          logger: (m) => console.log("TAM OCR:", m),
        }),
      ]);

      const chords = engResult.data.words.filter((w) => w.confidence > 80);
      const lyrics = tamResult.data.words.filter((w) => w.confidence > 80);

      const chordLines = groupLinesByY(chords);
      const lyricLines = groupLinesByY(lyrics);

      const linesTamil = [];

      for (let i = 0; i < Math.min(chordLines.length, lyricLines.length); i++) {
        const chordLine = createSpacedLine(chordLines[i].words);
        const lyricLine = createSpacedLine(lyricLines[i].words);
        linesTamil.push({ chordLine, lyricLine });
      }

      const song = {
        title,
        linesTamil,
      };

      await api.post("api/songs", song);
      setStatus("✅ Song saved successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to extract or save song.");
    } finally {
      setProcessing(false);
    }
  };


  const extractTextAndSubmit1 = async () => {
  if (!image || !title) {
    setStatus("❗ Song title and image are required.");
    return;
  }

  setProcessing(true);
  setStatus("⏳ Extracting Tamil and English text from image...");

  try {
    // OCR for English (chords)
    const resultEng = await Tesseract.recognize(image, "eng", {
      logger: (m) => console.log("ENG OCR:", m),
    });

    // OCR for Tamil (lyrics)
    const resultTam = await Tesseract.recognize(image, "tam", {
      logger: (m) => console.log("TAM OCR:", m),
    });

    // Clean and split into lines
    const engLines = resultEng.data.text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    const tamLines = resultTam.data.text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    // Match them line by line assuming alternation
    const linesTamil = [];
    const lineCount = Math.max(engLines.length, tamLines.length);

    for (let i = 0; i < lineCount; i += 2) {
      const chordLine = engLines[i] || "";
      const lyricLine = tamLines[i + 1] || "";

      linesTamil.push({ chordLine, lyricLine });
    }

    const song = {
      title,
      linesTamil,
    };

    await api.post("api/songs", song);
    setStatus("✅ Song saved successfully!");
  } catch (err) {
    console.error(err);
    setStatus("❌ Failed to extract or save song.");
  } finally {
    setProcessing(false);
  }
};

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h2>Add Tamil Song from Image</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>Song Title:</label>
        <br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter song title"
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Select Tamil Song Screenshot:</label>
        <br />
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <button onClick={extractTextAndSubmit1} disabled={processing}>
        {processing ? "Processing..." : "Extract Tamil & Save"}
      </button>

      {status && (
        <p
          style={{
            marginTop: "1rem",
            color: status.includes("✅") ? "green" : "red",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default AddSongFromImage;
