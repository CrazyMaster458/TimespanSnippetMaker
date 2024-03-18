import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Something went wrong. Please try again later.";
  }

  return message;
};

export const handleServerError = (error: any, setError: Function) => {
  if (error.response && error.response.data && error.response.data.errors) {
    const serverErrors = error.response.data.errors;
    Object.entries(serverErrors).forEach(([key, value]) => {
      const message = Array.isArray(value) ? value[0] : value;
      setError(key, {
        type: "server",
        message: message,
      });
    });
  } else if (
    error.response &&
    error.response.data &&
    error.response.data.error
  ) {
    setError("root", {
      type: "server",
      message: error.response.data.error,
    });
  } else {
    setError("root", {
      type: "server",
      message: "Something went wrong. Please try again later.",
    });
    console.error("Server error:", error);
  }
};
