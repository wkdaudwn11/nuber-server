import Place from "../../../entities/Place";
import User from "../../../entities/User";
import {
  DeletePlaceMutationArgs,
  DeletePlaceResponse,
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    DeletePlace: privateResolver(
      async (
        _,
        args: DeletePlaceMutationArgs,
        { req }
      ): Promise<DeletePlaceResponse> => {
        const user: User = req.user;
        try {
          const place = await Place.findOne({ id: args.placeId });
          if (place) {
            if (place.userId === user.id) {
              place.remove();
              return {
                ok: true,
                error: null,
              };
            } else {
              return {
                ok: false,
                error: "인증에 실패하였습니다.",
              };
            }
          } else {
            return {
              ok: false,
              error: "장소를 찾을 수 없습니다.",
            };
          }
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
