import React, { useState } from "react";
import { supabase } from "../../../Client.js";
import { useNavigate } from "react-router";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayname, setDisplayname] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayname,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Check your email to confirm!");
    navigate("/login");
  };

  return (
    <form onSubmit={handleSignup}>
    
      <input
        type="text"
        placeholder="Display Name"
        value={displayname}
        onChange={(e) => setDisplayname(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <small id="email-helper">
      We'll never share your email with anyone else.
    </small>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Sign Up</button>
     
    </form>
  );
};

export default Signup;
