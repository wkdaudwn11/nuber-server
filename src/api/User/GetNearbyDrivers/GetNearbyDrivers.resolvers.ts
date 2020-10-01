import { Between, getRepository } from "typeorm";
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
        try {
          /**
           * typeorm의 Between을 이용하여 현재 유저의 위도, 경도가 +-0.05인 운전자를 찾음 (근처 운전자를 찾음)
           * https://github.com/typeorm/typeorm
           *
           * typeorm을 사용하는 방식은 크게 두가지가 있음.
           * Data Mapper, Active Record
           * 우리가 작성한 entities 파일들을 보면, BaseEntity를 상속 받고 있는데, 이 방식이 Active Record 방식임.
           *
           * 근데 Between같은 Operator는 Active Record 형태에서는 작동하지 않음.
           * 그래서 이런것들을 쓸려면 Data Mapper 형태로 바꿔 줄 필요가 있음.
           * getRepository 라는 것으로 한 번 감싸주면 끝!
           */
          const drivers: User[] = await getRepository(User).find({
            isDriving: true,
            lastLat: Between(lastLat - 0.05, lastLat + 0.05),
            lastLng: Between(lastLng - 0.05, lastLng + 0.05),
          });
          return {
            ok: true,
            error: null,
            drivers,
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            drivers: null,
          };
        }
      }
    ),
  },
};
export default resolvers;
