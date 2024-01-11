import axiosClient from "@/axios";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStateContext } from "@/contexts/ContextProvider";
import { useState } from "react";
import { Link } from "react-router-dom";

export function LoginCard() {
    const { setCurrentUser, setUserToken } = useStateContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ __html: "" });

    const onSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setError({ __html: "" });
        type ErrorArray = string[];
    
        axiosClient
        .post("/login", {
          email: email,
          password: password,
        })
        .then(({ data }) => {
          setCurrentUser(data.user);
          setUserToken(data.token);
        })
        .catch((error) => {
          if (error.response) {
            const finalErrors = (
              Object.values(error.response.data.errors) as ErrorArray
            ).reduce<string[]>((accum, next) => [...accum, ...next], []);
            setError({ __html: finalErrors.join("<br />") });
          }
          console.log(error);
        });
      };

  return (
    <div /*className="grid place-content-center h-[90vh]"*/>
        <Card className="w-[25vw] h-[auto]">
        <CardHeader>
            <CardTitle>Login into your account</CardTitle>
            <CardDescription>To continue to Timestamp Snippet Maker.</CardDescription>
        </CardHeader>
        <CardContent>
            <form>
              <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" 
                        placeholder="Email" 
                        type="text" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* 
                    {errors && errors.email ?
                        <p className="error">{errors.email}</p> : null
                    } */}

                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password" 
                        type="password" 
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
              </div>
            </form>
        </CardContent>
          
        <CardFooter className="grid justify-stretch gap-2">
        {error.__html && (
            <div
            className="bg-red-500 text-sm rounded mb-2 p-2 px-3 text-white"
            dangerouslySetInnerHTML={error}
        ></div>)}
          <Button onClick={onSubmit}>Login</Button>
          <p className="redirect-link justify-self-center">Don't have an account? <Link className="text-blue-600 hover:underline underline-offset-3" to={"/signup"}>Singup</Link></p>
        </CardFooter>
    </Card>
    </div>
  )
}
