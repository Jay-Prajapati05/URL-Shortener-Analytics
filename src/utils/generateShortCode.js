import { nanoid } from "nanoid";

export const generateShortCode = (length = 7) => {
  return nanoid(length);
};
