// import { useState } from 'react'
// import './App.css'
// import { auth } from './firebase';


// function App() {
 
//   return (
//     <>
//     <form action="" onSubmit={e => e.preventDefault()}>
//       <input type="text" name="email" id="email" />
//       <input type="text" name="password" id="password" />
//       <button type="submit">login</button>
//     </form>
//     <button type="button" onClick={async() => {
//        try {
//         // Create a Google Auth provider
//         const provider = new auth.GoogleAuthProvider();
    
//         // Sign in with Google
//         const result = await firebase.auth().signInWithPopup(provider);
    
//         // The signed-in user information, including Google user data
//         const user = result.user;
    
//         // Save or use user data as needed (e.g., save to MongoDB using Mongoose)
//         console.log(user);
//       } catch (error) {
//         console.error(error);
//       }
//     }}>LOGIN WITH GOOGLE</button>
//     </>
//   )
// }

// export default App

import { auth , googleProvider} from "./firebase";
import { createUserWithEmailAndPassword,signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";

 const Auth = () => {
  const [email, setEmail] = useState("");
  let data ="";
  const [password, setPassword] = useState("");
    console.log(auth?.currentUser?.email);
  const signIn = async () => {
    try {
    await createUserWithEmailAndPassword(auth, email, password);
    } catch (err){
      console.error(err);
    }
  };
  const signInWithGoogle = async () => {
    try {
   data =  await signInWithPopup(auth,googleProvider);
   console.log(data)
    } catch (err){
      console.error(err);
    }
  };
  const logOut = async () => {
    try {
    await signOut(auth);
    } catch (err){
      console.error(err);
    }
  };
  return (
    <div>
      <input placeholder="Email.." onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password.."
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signIn}> Signin</button>
      <button onClick={signInWithGoogle}> Signin with google</button>
      <button onClick={logOut}> logOut</button>
    </div>
  );
};


export default Auth