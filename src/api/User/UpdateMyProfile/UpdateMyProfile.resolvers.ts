import User from "../../../entities/User";
import {
  UpdateMyProfileMutationArgs,
  UpdateMyProfileResponse,
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (
        _,
        args: UpdateMyProfileMutationArgs,
        { req }
      ): Promise<UpdateMyProfileResponse> => {
        try {
          const user: User = req.user;
          const notNull = cleanNullArgs(args);

          // 비밀번호도 수정하는지 체크하여, 체크한다면 hash값이 들어가게끔 해줘야함. 이렇게 해주면 beforeUpdate 걸어둔 거 덕분에 알아서 됨.
          if (args.password !== null) {
            user.password = args.password;
            user.save();
          }

          await User.update({ id: user.id }, { ...notNull });

          return {
            ok: true,
            error: null,
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
          };
        }
      }
    ),
  },
};

export default resolvers;
