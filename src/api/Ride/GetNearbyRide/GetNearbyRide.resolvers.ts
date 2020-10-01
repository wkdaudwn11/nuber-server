import { Between, getRepository } from "typeorm";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { GetNearbyRideResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Query: {
    GetNearbyRide: privateResolver(
      async (_, __, { req }): Promise<GetNearbyRideResponse> => {
        const user: User = req.user;

        /**
         * 현재 유저가 드라이버 인 경우에는 isDriving이 true임
         * 근처에 탑승을 원하는 유저들을 찾아서 리턴해주는 기능.
         */
        if (user.isDriving) {
          const { lastLat, lastLng } = user;
          try {
            /**
             * 요청중 상태이고, 픽업 위치가 사용자 근처인 ride 찾기
             * Between, getRepository에 대한 자세한 주석은 src/api/User/GetNearbyDrivers/GetNearbyDrivers.resolvers.ts에 주석으로 자세히 설명해뒀음.
             * 쉽게 설명하자면, Between을 쓸려면 getRepository로 한 번 감싸고 시작해야함.
             */
            const ride = await getRepository(Ride).findOne({
              status: "REQUESTING",
              pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
              pickUpLng: Between(lastLng - 0.05, lastLng + 0.05),
            });

            if (ride) {
              return {
                ok: true,
                error: null,
                ride,
              };
            } else {
              return {
                ok: true,
                error: null,
                ride: null,
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              ride: null,
            };
          }
        } else {
          return {
            ok: false,
            error: "You are not a driver",
            ride: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
