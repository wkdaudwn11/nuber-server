import User from "../../../entities/User";
import {
  EmailSignInMutationArgs,
  EmailSignInResponse,
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignIn: async (
      _,
      args: EmailSignInMutationArgs
    ): Promise<EmailSignInResponse> => {
      const { email, password } = args;
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return {
            ok: false,
            error: "존재하지 않는 Email 입니다.",
            token: null,
          };
        }

        const checkPassword = await user.comparePassword(password); // 입력한 비밀번호와 DB에 저장되어 있는 비밀번호 비교

        if (checkPassword) {
          return {
            ok: true,
            error: null,
            token: "Coming Soon!",
          };
        } else {
          return {
            ok: false,
            error: "비밀번호가 잘못되었습니다.",
            token: null,
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }
    },
  },
};
export default resolvers;
