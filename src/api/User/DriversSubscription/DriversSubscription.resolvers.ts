const resolvers = {
  Subscription: {
    DriversSubscription: {
      subscribe: (_, __, { pubSub }) => {
        /**
         * 어떤 유저가 근처의 드라이버를 찾기 위해서 driverUpdate 라는 채팅방에 입장하는 거라고 이해하는 게 편함
         * driverUpdate 라는 방에는 현재 내 위치랑 가까운 드라이버들의 정보가 있음
         * 그걸 보기 위해서 방에 입장하는? 거라고 생각하는 게 좀 더 이해가 편할듯함
         */
        return pubSub.asyncIterator("driverUpdate");
      },
    },
  },
};
export default resolvers;
