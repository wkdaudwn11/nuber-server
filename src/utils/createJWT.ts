import jwt from "jsonwebtoken";

const createJWT = (id: number): string => {
  const token = jwt.sign(
    {
      id,
    },
    "secret"
  );
  return token;
};

export default createJWT;
