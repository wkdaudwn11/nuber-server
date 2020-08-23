import User from "../../../entities/User";
import {
  FacebookConnectMutationArgs,
  FacebookConnectResponse,
} from "./../../../types/graph.d";
import { Resolvers } from "./../../../types/resolvers.d";

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
          return {
            ok: true,
            error: null,
            token: "already, Coming soon",
          };
        } else {
          // 새로운 유저
          await User.create({
            ...args,
            profilePhoto: `http://graph.facebook.com/${fbId}/picture?type=square`,
          }).save();
          return {
            ok: true,
            error: null,
            token: "Created, Coming soon",
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
