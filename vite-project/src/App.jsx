import { useState } from 'react'
import './App.css'
import { auth } from './firebase';


function App() {
 
  return (
    <>
    <form action="" onSubmit={e => e.preventDefault()}>
      <input type="text" name="email" id="email" />
      <input type="text" name="password" id="password" />
      <button type="submit">login</button>
    </form>
    <button type="button" onClick={async() => {
       try {
        // Create a Google Auth provider
        const provider = new auth.GoogleAuthProvider();
    
        // Sign in with Google
        const result = await firebase.auth().signInWithPopup(provider);
    
        // The signed-in user information, including Google user data
        const user = result.user;
    
        // Save or use user data as needed (e.g., save to MongoDB using Mongoose)
        console.log(user);
      } catch (error) {
        console.error(error);
      }
    }}>LOGIN WITH GOOGLE</button>
    </>
  )
}

export default App
