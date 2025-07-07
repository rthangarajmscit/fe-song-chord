// import { useState } from 'react';
// import './App.css';
// import SongForm from './components/SongForm';
// import SongList from './components/SongList';

// function App() {
//   const [songs, setSongs] = useState([]);

//   const addSong = (newSong) => {
//     setSongs([...songs, newSong]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <h1 className="text-3xl font-bold text-center mb-6">🎵 Christian Chorded Song App</h1>

//       <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
//         <SongForm onAddSong={addSong} />
//       </div>

//       <div className="max-w-4xl mx-auto mt-8">
//         <SongList songs={songs} />
//       </div>
//     </div>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SongList from "./components/SongList";
import AddSongPage from "./components/AddSongPage";

const App = () => {
  return (
    <Router>
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Song List</Link>
        <Link to="/add">Add New Song</Link>
      </nav>

      <Routes>
        <Route path="/" element={<SongList />} />
        <Route path="/add" element={<AddSongPage />} />
      </Routes>
    </Router>
  );
};

export default App;
