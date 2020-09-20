import User from "../../../entities/User";
import {
  FacebookConnectMutationArgs,
  FacebookConnectResponse,
} from "./../../../types/graph.d";
import { Resolvers } from "../../../types/resolvers";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
  Mutation: {
    FacebookConnect: async (
      _,
      args: FacebookConnectMutationArgs
    ): Promise<FacebookConnectResponse> => {
      const { fbId } = args;

      try {
        const existingUser = await User.findOne({ fbId });

        if (existingUser) {
          // 기존 유저
          const token = createJWT(existingUser.id);
          return {
            ok: true,
            error: null,
            token,
          };
        } else {
          // 새로운 유저
          const newUser = await User.create({
            ...args,
            profilePhoto: `http://graph.facebook.com/${fbId}/picture?type=square`,
          }).save();
          const token = createJWT(newUser.id);
          return {
            ok: true,
            error: null,
            token,
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
