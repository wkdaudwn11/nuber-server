import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
  Subscription: {
    DriversSubscription: {
      /**
       * 어떤 유저가 근처의 드라이버를 찾기 위해서 driverUpdate 라는 채팅방에 입장하는 거라고 이해하는 게 편함
       * driverUpdate 라는 방에는 현재 내 위치랑 가까운 드라이버들의 정보가 있음
       * 그걸 보기 위해서 방에 입장하는? 거라고 생각하는 게 좀 더 이해가 편할듯함
       */
      subscribe: withFilter(
        /**
         * 예를들어 우리는 한국에 있는데, 중국에 있는 드라이버들의 위치를 알고 싶지는 않을 것임.
         * 해당 유저에게 알맞는 드라이버 혹은 해당 드라이버에게 알맞는 유저가 표시가 되어야함.
         * 현재 프로젝트에선 그게 위치 기반임. 자신의 주변에 있는 유저 혹은 드라이버를 표시해주면 됨.
         * 그래서 우리는 위치를 기반으로 Filter를 해준 후에 지도에 표시를 해주면 됨.
         *
         * graphql-yoga에서 제공해주는 함수중에는 withFilter 라는 함수가 존재함.
         * 2개의 파라미터값을 보내줘야 하는데, 둘 다 함수 형태로 보내야 함.
         *
         * 첫번째 함수는 pubSub의 asyncIterator 함수임.
         * 음..asyncIterator()가 뭔지 잘 모르겠는데..driverUpdate라는 채널에 있는 구독자들을 나타내는 거 같음.
         * 어떤 구독자들이 모여 있는 채널..그니까 타겟을 말하는 거 같음.
         *
         * 두번째 함수가 Filter함수임.
         * 두번째 함수에서는 true || false를 return 해줌.
         * 이때, true일 경우에 구독중인 user들에게 결과물을 전송해줌.
         *
         * 결론은, 두번째 파라미터 함수에서 true가 리턴이 되면, 타겟(첫번째 파라미터, 채널)에 해당하는 구독자들에게 결과물을 return 해주는 형태인 거 같음.
         */
        (_, __, { pubSub }) => pubSub.asyncIterator("driverUpdate"), // 첫번째 파라미터 함수
        (payload, _, { context }) => {
          /**
           * 여기서 context가 index,ts, app.ts에서 만들어서 return한 req.context 값임.
           * 현재 driverUpdate라는 채널을 구독중인 User들의 정보임
           */
          const user: User = context.currentUser;

          /**
           * 운전자들의 위치를 payload에서 받아옴
           * payload는 ReportMovement Resolver 값임.
           * ReportMovement Resolver에서 pubSub.publish() 해준 값임.
           */
          const {
            DriversSubscription: {
              lastLat: driverLastLat,
              lastLng: driverLastLng,
            },
          } = payload;

          // 현재 구독자의 위치
          const { lastLat: userLastLat, lastLng: userLastLng } = user;

          // 비교 후 true 혹은 false를 return
          return (
            driverLastLat >= userLastLat - 0.05 &&
            driverLastLat <= userLastLat + 0.05 &&
            driverLastLng >= userLastLng - 0.05 &&
            driverLastLng <= userLastLng + 0.05
          );
        } // 두번째 파라미터 함수
      ),
    },
  },
};
export default resolvers;
