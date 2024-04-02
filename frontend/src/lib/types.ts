import { z } from "zod";

const usernameRegex = /^[a-zA-Z0-9_]{3,45}$/;
const hashTagRegex = /^[a-zA-Z0-9_]{3,25}$/;
const nameRegex = /^[a-zA-Z0-9_& ]{3,25}$/;

const basicSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const snippetTagSchema = z.object({
  tag_id: z.number(),
  snippet_id: z.number(),
});

const snippetSchema = z.object({
  id: z.number(),
  description: z.string(),
  starts_at: z.string(),
  ends_at: z.string(),
  transcript: z.string(),
  video_url: z.string(),
  video_id: z.number(),
  snippet_tags: z.array(snippetTagSchema),
});

const videoSchema = z.object({
  id: z.number(),
  title: z.string(),
  image_url: z.string(),
  video_url: z.string(),
  published: z.boolean(),
  user_id: z.number(),
  host_id: basicSchema,
  video_type_id: basicSchema,
  guests: z.array(basicSchema),
});

const userSchema = z.object({
  id: z.number(),
  username: z.string(),
});

export const meSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  fast_cut: z.number(),
});

const timePropSchema = z.object({
  hours: z.string().max(2),
  minutes: z.string().max(2),
  seconds: z.string().max(2),
});

const optionSchema = z.object({
  value: z.number(),
  label: z.string(),
});

const loggedUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  admin: z.number(),
});

// UPDATE/CREATE SCHEMAS

// Generic function to generate schema and type for entities
const generateSchema = (
  entityName: string,
  regex: RegExp,
  message?: string,
) => {
  const schema = z.object({
    id: z.number().optional(),
    name: z
      .string()
      .trim()
      .min(3, `${entityName} must be at least 3 characters`)
      .max(25, `${entityName} must be less than 25 characters`)
      .regex(
        regex,
        `${entityName} must contain only letters, digits${message} and underscores`,
      ),
  });

  return { schema };
};

// Generate schemas and types for different entities
export const { schema: tagSchema } = generateSchema("Tag", hashTagRegex);
export const { schema: videoTypeSchema } = generateSchema(
  "Video type",
  nameRegex,
  ", ampersands, spaces",
);
export const { schema: influencerSchema } = generateSchema(
  "Influencer",
  nameRegex,
  ", ampersands, spaces",
);

export const updateSnippetSchema = z.object({
  id: z.number(),
  description: z
    .string()
    .max(255, "Description must be less than 255 characters")
    .min(3, "Description must be at least 3 characters"),
  starts_at: z.string(),
  ends_at: z.string(),
  video_id: z.number(),
  snippet_tags: z.array(z.number()).optional(),
});

export const updateVideoSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .max(255, "Title must be less than 255 characters")
    .min(3, "Title must be at least 3 characters"),
  host_id: z.number(),
  video_type_id: z.number(),
  guests: z.array(z.number()).optional(),
  visibility: z.string(),
});

// AUTH SCHEMAS

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be less than 50 characters"),
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

// TYPES

export type TSignUpSchema = z.infer<typeof signUpSchema>;
export type TLoginSchema = z.infer<typeof loginSchema>;
export type UpdateSnippet = z.infer<typeof updateSnippetSchema>;
export type UpdateVideo = z.infer<typeof updateVideoSchema>;

export type LoggedUser = z.infer<typeof loggedUserSchema>;

export type Me = z.infer<typeof meSchema>;
export type Snippet = z.infer<typeof snippetSchema>;
export type User = z.infer<typeof userSchema>;
export type Video = z.infer<typeof videoSchema>;
export type SnippetTag = z.infer<typeof snippetTagSchema>;

export type BasicProp = z.infer<typeof basicSchema>;
export type Tag = z.infer<typeof basicSchema>;
export type VideoType = z.infer<typeof basicSchema>;
export type Influencer = z.infer<typeof basicSchema>;

export type TimeProp = z.infer<typeof timePropSchema>;
export type Option = z.infer<typeof optionSchema>;
