import { Greeting } from "./../../types/graph.d";

const resolvers = {
  Query: {
    sayHello: (): Greeting => {
      return {
        text: "test",
        error: false,
      };
    },
  },
};
export default resolvers;
