import { Schema } from "zod";

export const validateData = (data: object, schema: Schema) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    let errors = {};
    result.error.issues.forEach((issue) => {
      if (!(issue.path[0] in errors)) {
        errors = { ...errors, [issue.path[0]]: issue.message };
      }
    });
    return { result: null, errors: errors };
  }
  return { result: result, errors: null };
};
