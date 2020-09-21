import User from "../../../entities/User";
import {
  UpdateMyProfileMutationArgs,
  UpdateMyProfileResponse,
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
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
          const newUser = {};
          Object.keys(args).forEach((key) => {
            if (args[key] !== null) {
              newUser[key] = args[key];
            }
          });
          await User.update({ id: user.id }, { ...newUser });
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
