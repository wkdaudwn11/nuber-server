import User from "../../../entities/User";
import {
  ReportMovementMutationArgs,
  ReportMovementResponse,
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    ReportMovement: privateResolver(
      async (
        _,
        args: ReportMovementMutationArgs,
        { req, pubSub }
      ): Promise<ReportMovementResponse> => {
        const user: User = req.user;
        const notNull = cleanNullArgs(args);
        try {
          await User.update({ id: user.id }, { ...notNull });
          /**
           * 드라이버의 위치가 바뀌었을 때 driverUpdate 방에 계속 정보를 push 해주는 거라고 생각하면 될듯
           * driverUpdate라는 방은 일반 사용자들이 드라이버를 찾기 위해서 구독중일테고
           * 그 방에다가 나 드라이버에요~ 라고 알려주기 위해서 명함 내미는 것임.
           */
          pubSub.publish("driverUpdate", { DriversSubscription: user });
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
