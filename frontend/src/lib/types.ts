import { z } from "zod";

const usernameRegex = /^[a-zA-Z0-9_]{3,45}$/;
const hashTagRegex = /^[a-zA-Z0-9_]{3,25}$/;
const nameRegex = /^[a-zA-Z0-9_& ]{3,25}$/;

export const basicSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim(),
});

export const tagSchema = basicSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, { message: "Tag must be at least 3 characters" })
    .max(25, { message: "Tag must be less than 25 characters" })
    .regex(hashTagRegex, {
      message: "Tag must contain only letters, numbers, or underscores",
    }),
});

export const videoTypeSchema = basicSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, "Video type must be at least 3 characters")
    .max(25, "Video type must be less than 25 characters")
    .regex(
      nameRegex,
      "Video type must contain only letters, digits, underscores, ampersands, and spaces",
    ),
});

export const influencerSchema = basicSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, { message: "Influencer must be at least 3 characters" })
    .max(25, { message: "Influencer must be less than 25 characters" })
    .regex(nameRegex, {
      message:
        "Influencer must contain only letters, digits, underscores, ampersands, and spaces",
    }),
});

export const snippetTagSchema = z.object({
  tag_id: z.number(),
  snippet_id: z.number(),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be less than 50 characters"),
});

export const snippetUpdateSchema = z.object({
  id: z.number(),
  description: z.string(),
  starts_at: z.string(),
  ends_at: z.string(),
  video_id: z.number(),
  snippet_tags: z.array(z.number()),
});

export type SnippetUpdate = z.infer<typeof snippetUpdateSchema>;

export const snippetSchema = z.object({
  id: z.number(),
  description: z.string(),
  starts_at: z.string(),
  ends_at: z.string(),
  transcript: z.string(),
  video_url: z.string(),
  video_id: z.number(),
  snippet_tags: z.array(snippetTagSchema),
});

export const signUpSchema = loginSchema
  .extend({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(45, "Username must be less than 45 characters")
      .regex(
        usernameRegex,
        "Username must contain only letters, numbers, or underscores",
      ),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  });

export type TSignUpSchema = z.infer<typeof signUpSchema>;
export type TLoginSchema = z.infer<typeof loginSchema>;

export type Snippet = z.infer<typeof snippetSchema>;
export type SnippetTag = z.infer<typeof snippetTagSchema>;

export type BasicData = z.infer<typeof basicSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type VideoType = z.infer<typeof videoTypeSchema>;
export type Influencer = z.infer<typeof influencerSchema>;

export type SimpleProp = {
  id: number;
  name: string;
};

export const videoUpdateSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .max(255, "Title must be less than 255 characters")
    .min(3, "Title must be at least 3 characters"),
  host_id: z.number().optional(),
  video_type_id: z.number().optional(),
  guests: z.array(z.number()).optional(),
});

export type VideoUpdateData = z.infer<typeof videoUpdateSchema>;

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
  value: number;
  label: string;
};
