import React, { useState } from 'react';
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL,
});
const SongForm = () => {
  const [title, setTitle] = useState('');
  const [lines, setLines] = useState([
    { chordLine: '', lyricLine: '' }
  ]);

  const handleLineChange = (index, field, value) => {
    const updatedLines = [...lines];
    updatedLines[index][field] = value;
    setLines(updatedLines);
  };

  const addLine = () => {
    setLines([...lines, { chordLine: '', lyricLine: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('api/songs', {
        title,
        lines
      });
      alert('Song saved successfully!');
      setTitle('');
      setLines([{ chordLine: '', lyricLine: '' }]);
    } catch (error) {
      console.error('Error saving song:', error);
      alert('Failed to save song.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add a New Song</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Song Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {lines.map((line, index) => (
          <div key={index} className="mb-4">
            <label className="block font-semibold mb-1">Line {index + 1}</label>
            <input
              type="text"
              placeholder="Chord Line (e.g., C    G    Am    F)"
              value={line.chordLine}
              onChange={(e) => handleLineChange(index, 'chordLine', e.target.value)}
              className="w-full mb-2 border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Lyric Line (e.g., Ennai Maravatha Yesuvae)"
              value={line.lyricLine}
              onChange={(e) => handleLineChange(index, 'lyricLine', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addLine}
          className="mr-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Line
        </button>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Song
        </button>
      </form>
    </div>
  );
};

export default SongForm;
