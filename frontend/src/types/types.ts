import { z } from "zod";

const usernameRegex = /^[a-zA-Z0-9_]{3,45}$/;

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(45, "Username must be less than 45 characters")
      .regex(
        usernameRegex,
        "Username must contain only letters, numbers, or underscores",
      ),
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be less than 50 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  });

export type TSignUpSchema = z.infer<typeof signUpSchema>;

export type SimpleProp = {
  id: number;
  name: string;
};

export type Tag = SimpleProp;
export type VideoType = SimpleProp;
export type Influencer = SimpleProp;

export type SnippetTag = {
  tag_id: number;
  snippet_id: number;
};

export type Snippet = {
  id: number;
  description: string;
  starts_at: string;
  ends_at: string;
  transcript: string;
  video_url: string;
  video_id: number;
  video_type: VideoType;
  snippet_tags: SnippetTag[];
};

export type Video = {
  id: number;
  title: string;
  image_url: string;
  video_url: string;
  host_id: Influencer;
  video_type: VideoType;
  snippets: Snippet[];
};

export type TimeProp = {
  hours: string;
  minutes: string;
  seconds: string;
};

export type Option = {
  value: string | number;
  label: string;
};
