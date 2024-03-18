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
import { TSignUpSchema, signUpSchema } from "@/lib/types";
import { LoadingButton } from "./LoadingButton";
import { handleServerError } from "@/lib/utils";

export function SignupCard() {
  const { setCurrentUser, setUserToken } = useStateContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutateAsync: signUp, isPending } = useMutation({
    mutationFn: (formData: TSignUpSchema) =>
      postData("/signup", formData, signUpSchema),
    onSuccess: ({ token, user }) => {
      setCurrentUser(user);
      setUserToken(token);
    },
    onError: (error) => handleServerError(error, setError),
  });

  const onSubmit = async (data: TSignUpSchema) => {
    signUp(data);
  };

  return (
    <>
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
                type="email"
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
    </>
  );
}
