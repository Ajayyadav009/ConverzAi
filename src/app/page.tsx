
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";


export default function Home() {

  const { data: session } = authClient.useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () =>{
    authClient.signUp.email({
      email, 
      name,
       password,

    }, {
      onError: () =>{
        window.alert("Something went wrong");
      },
      onSuccess: () =>{
        window.alert("Success")
      }
    })
  }

   const onLogging = () =>{
    authClient.signIn.email({
      email, 
     password,

    }, {
      onError: () =>{
        window.alert("Something went wrong");
      },
      onSuccess: () =>{
        window.alert("Success")
      }
    })
  }
  if(session){
    return(
      <div className="flex flex-col p-4 gap-y-4">
        <p className="text-lg">Logged in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>
          Sign out
        </Button>
      </div>
    )
  }
  return (
    <div className="p-4 flex flex-col gap-y-4">
      <h2 className="text-xl font-bold">Sign Up</h2>
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={onSubmit}>
        Create User
      </Button>

      <h2 className="text-xl font-bold mt-6">Log In</h2>
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={onLogging}>
        Log in
      </Button>
    </div>
  );



};


