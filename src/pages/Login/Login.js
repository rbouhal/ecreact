import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';  // Import required Firebase functions
import { provider } from '../../firebaseConfig';  // Import Google provider
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import './Login.css';
import { AiOutlineUser } from 'react-icons/ai';  // Import a user icon
import { AiOutlineKey } from "react-icons/ai";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();  // Initialize the navigate function
  const auth = getAuth();  // Initialize Firebase Auth

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/find-events');  // Redirect to /find-events after login
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);  // Using Google Sign-In with Firebase v9
      console.log("User signed in: ", result.user);
      navigate('/find-events');  // Redirect to /find-events after Google sign-in
    } catch (error) {
      console.error("Error during Google sign-in: ", error);
      setError(error.message);
    }
  };

  return (
    <div className='login-page'>
      <div className="login-container">
        <div className="login-form">
          <h2 className='login-header'>Login</h2>
          <p className='login-header'>Access exclusive local events and marketing tools for your hotel.</p>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="input-field">
              <AiOutlineUser className="login-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="input-field">
              <AiOutlineKey className="login-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="login-button">Login Now</button>
          </form>
         
          <div className="divider">
            <span>Login with Others</span>
          </div>
          <button onClick={handleGoogleSignIn} className="google-login">
            <img src="/images/google-icon.svg" alt="Google Icon" />
            Login with Google
          </button>
          </div>
          <div className="login-image">
            <img src="/images/login-hotel.jpg" alt="Hotel imagery for login"/>
          </div>
   
      </div>
    </div>
  );
}

export default Login;
