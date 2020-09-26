import { Between } from "typeorm";
import User from "../../../entities/User";
import { GetNearbyDriversResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Query: {
    GetNearbyDrivers: privateResolver(
      async (_, __, { req }): Promise<GetNearbyDriversResponse> => {
        const user: User = req.user;
        const { lastLat, lastLng } = user;

        // typeorm의 Between을 이용하여 현재 유저의 위도, 경도가 +-0.05인 운전자를 찾음 (근처 운전자를 찾음)
        const drivers = await User.find({
          isDriving: true,
          lastLat: Between(lastLat - 0.05, lastLat + 0.05),
          lastLng: Between(lastLng - 0.05, lastLng + 0.05),
        });
      }
    ),
  },
};
export default resolvers;
