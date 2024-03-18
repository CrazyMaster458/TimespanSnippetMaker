import { postData } from "@/api";
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
import { TLoginSchema, loginSchema } from "@/lib/types";
import { handleServerError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { LoadingButton } from "./LoadingButton";

export function LoginCard() {
  const { setCurrentUser, setUserToken } = useStateContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: (formData: TLoginSchema) =>
      postData("/login", formData, loginSchema),
    onSuccess: ({ user, token }) => {
      setCurrentUser(user);
      setUserToken(token);
    },
    onError: (error) => handleServerError(error, setError),
  });

  const onSubmit = async (data: TLoginSchema) => {
    login(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="h-[auto] w-[25vw]">
          <CardHeader>
            <CardTitle>Login into your account</CardTitle>
            <CardDescription>
              To continue to Timestamp Snippet Maker.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
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
            </div>
          </CardContent>

          <CardFooter className="grid justify-stretch gap-2">
            {isPending ? (
              <LoadingButton />
            ) : (
              <Button type="submit">Login</Button>
            )}

            {errors.root && (
              <p className="text-sm text-red-500">{`${errors.root.message}`}</p>
            )}

            <p className="redirect-link justify-self-center">
              Don't have an account?{" "}
              <Link
                className="underline-offset-3 text-blue-600 hover:underline"
                to={"/signup"}
              >
                Singup
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
