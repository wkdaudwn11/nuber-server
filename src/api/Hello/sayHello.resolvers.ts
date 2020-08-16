import { SayHelloQueryArgs, SayHelloResponse } from "./../../types/graph.d";

const resolvers = {
  Query: {
    sayHello: (_, args: SayHelloQueryArgs): SayHelloResponse => {
      return {
        text: `Hello ${args.name}`,
        error: false,
      };
    },
  },
};
export default resolvers;
