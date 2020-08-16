import { Options } from "graphql-yoga";
import app from "./app";

// graphql-yoga의 options 변수들
const PORT: number | string = process.env.PORT || 4000; // 포트
const PLAYGROUND_ENDPOINT: string = "/playground"; // playground 주소
const GRAPHQL_ENDPOINT: string = "/graphql"; // graphql api 주소

// app의 옵션
const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT,
};

// app의 callback 함수
const handleAppStart = () => {
  console.log(`Listening server on ${PORT}...`);
};

// app 시작
app.start(appOptions, handleAppStart);
