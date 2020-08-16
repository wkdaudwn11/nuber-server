/**
 * api폴더에 들어있는 것들은 모두 합쳐서 하나의 schema로 합쳐주는 역할을 하는 파일
 */
import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import path from "path";

// api폴더 안에 확장자가 graphql인 모든 파일을 담는 변수
const allTypes: GraphQLSchema[] = fileLoader(
  path.join(__dirname, "./api/**/*.graphql")
);

/**
 * api폴더 안에 확장자가 resolvers.*인 모든 파일을 담는 변수
 * 주의) *.resolvers.ts로 하면 안됨. 나중에 빌드하면 js로 바뀌기 때문.
 */
const allResolvers: any[] = fileLoader(
  path.join(__dirname, "./api/**/*.resolvers.*")
);

// 위에서 가져온 모든 graphql파일들을 합치는 작업
const mergedTypes = mergeTypes(allTypes);

// 위에서 가져온 모든 resolvers파일을 합치는 작업
const mergedResolvers = mergeResolvers(allResolvers);

const schema = makeExecutableSchema({
  typeDefs: mergedTypes,
  resolvers: mergedResolvers,
});

export default schema;
