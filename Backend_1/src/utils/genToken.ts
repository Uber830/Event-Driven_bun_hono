import { Jwt } from "hono/utils/jwt";

const genToken = (id: string) => {
  return Jwt.sign(
    {
      id,
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
    process.env.JWT_SECRET || "",
  );
};

export default genToken;
