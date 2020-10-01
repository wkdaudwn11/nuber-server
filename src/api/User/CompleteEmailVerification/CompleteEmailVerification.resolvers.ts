import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import {
  CompleteEmailVerificationMutationArgs,
  CompleteEmailVerificationResponse,
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    CompleteEmailVerification: privateResolver(
      async (
        _,
        args: CompleteEmailVerificationMutationArgs,
        { req }
      ): Promise<CompleteEmailVerificationResponse> => {
        const user: User = req.user;
        const { key } = args;
        if (user.email) {
          try {
            const verification = await Verification.findOne({
              key,
              payload: user.email,
            });
            if (verification) {
              // user.verifiedEmail = true;
              // user.save();

              // 이메일 인증 후에 비밀번호 Hash값이 바뀌는 버그가 있어서 코드 수정함.
              await User.update({ email: user.email }, { verifiedEmail: true });

              return {
                ok: true,
                error: null,
              };
            } else {
              return {
                ok: false,
                error: "이메일 인증에 실패하였습니다.",
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
            };
          }
        } else {
          return {
            ok: false,
            error: "존재하지 않는 이메일입니다.",
          };
        }
      }
    ),
  },
};

export default resolvers;
