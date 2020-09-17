import jwt from "jsonwebtoken";

const createJWT = (id: number): string => {
  const token = jwt.sign(
    {
      id,
    },
    ")xphKBkm?J/e%hvaJpJ}ZL7@Xp@9h&V9D<w]SbYQ[F"
  );
  return token;
};

export default createJWT;
