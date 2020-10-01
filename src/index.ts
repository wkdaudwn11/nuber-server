import dotenv from "dotenv";
dotenv.config();
import { Options } from "graphql-yoga";
import { createConnection } from "typeorm";
import app from "./app";
import connectionOptions from "./ormConfig";
import decodeJWT from "./utils/decodeJWT";

// graphql-yoga의 options 변수들
const PORT: number | string = process.env.PORT || 4000; // 포트
const PLAYGROUND_ENDPOINT: string = "/playground"; // playground 주소
const GRAPHQL_ENDPOINT: string = "/graphql"; // graphql api 주소
const SUBSCRIPTION_ENDPOINT: string = "/subscriptions"; // 구독 관련 주소 (socket 연결 주소)

// app의 옵션
const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT,
  subscriptions: {
    path: SUBSCRIPTION_ENDPOINT,
    onConnect: async (connectionParams) => {
      /**
       * onConnect()는 socket이 연결 될 때, 즉 구독을 할 때 실행되는 함수
       * 이때 인증된 회원인지 검사한다. (JWT 토큰 검사)
       */
      const token = connectionParams["X-JWT"];
      if (token) {
        const user = await decodeJWT(token);
        if (user) {
          return {
            currentUser: user,
          };
        }
      }
      throw new Error("인증되지 않은 회원이므로 구독 할 수 없습니다.");
    },
  },
};

// app의 callback 함수
const handleAppStart = () => {
  console.log(`Listening server on ${PORT}...`);
};

// DB 연결 후 app 시작
createConnection(connectionOptions)
  .then(() => {
    app.start(appOptions, handleAppStart);
  })
  .catch((error) => console.log(error));
