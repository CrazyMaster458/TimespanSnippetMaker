import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStateContext } from "@/contexts/ContextProvider";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TSignUpSchema, signUpSchema } from "@/types/types";
import { LoadingButton } from "./LoadingButton";

export function SignupCard() {
  const { setCurrentUser, setUserToken } = useStateContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutateAsync: signUp, isPending } = useMutation({
    mutationFn: (formData: object) => postData("/signup", formData),
    onSuccess: ({ token, user }) => {
      console.log("User signed up successfully.", user, token);
      setCurrentUser(user);
      setUserToken(token);
    },
    onError: (error) => {
      let errorMessage = "An error occurred during signup.";
      //@ts-ignore
      if (error.response && error.response.data && error.response.data.errors) {
        //@ts-ignore
        const serverErrors = error.response.data.errors;
        Object.entries(serverErrors).forEach(([key, value]) => {
          const message = Array.isArray(value) ? value[0] : value;
          setError(key as keyof TSignUpSchema, {
            type: "server",
            message: message,
          });
        });
      } else {
        setError("root", { type: "server", message: errorMessage });
        console.error("Server error:", error);
      }
    },
  });

  const onSubmit = async (data: TSignUpSchema) => {
    signUp(data);
  };

  return (
    <div /*className="grid place-content-center h-[90vh]"*/>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-[25vw]">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              To continue to Timestamp Snippet Maker.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                {...register("username")}
                type="text"
                id="username"
                placeholder="Username"
              />

              {errors.username && (
                <p className="text-sm text-red-500">{`${errors.username.message}`}</p>
              )}

              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                id="email"
                placeholder="Email"
                type="text"
              />

              {errors.email && (
                <p className="text-sm text-red-500">{`${errors.email.message}`}</p>
              )}

              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Password"
              />

              {errors.password && (
                <p className="text-sm text-red-500">{`${errors.password.message}`}</p>
              )}

              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input
                {...register("password_confirmation")}
                id="password_confirmation"
                type="password"
                placeholder="Confirm Password"
              />

              {errors.password_confirmation && (
                <p className="text-sm text-red-500">{`${errors.password_confirmation.message}`}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="grid justify-stretch gap-2">
            {isPending ? (
              <LoadingButton />
            ) : (
              <Button type="submit">Signup</Button>
            )}

            {errors.root && (
              <p className="text-sm text-red-500">{`${errors.root.message}`}</p>
            )}

            <p className="redirect-link justify-self-center">
              Already have an account?{" "}
              <Link
                className="underline-offset-3 text-blue-600 hover:underline"
                to={"/login"}
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
