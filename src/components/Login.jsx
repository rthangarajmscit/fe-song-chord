import { useState } from "react";
import axios from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await axios.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    onLogin(res.data.user);
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <input className="w-full p-2 border mb-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full p-2 border mb-2" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white w-full py-2" onClick={login}>Login</button>
    </div>
  );
}
