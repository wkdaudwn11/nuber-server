import { GraphQLServer, PubSub } from "graphql-yoga";
import { NextFunction, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from "./utils/decodeJWT";

class App {
  public app: GraphQLServer;
  public pubSub: any;

  constructor() {
    this.pubSub = new PubSub();
    this.pubSub.ee.setMaxListeners(99);
    this.app = new GraphQLServer({
      schema,
      context: (req) => {
        /**
         * index.ts를 봐보면 onConnect() 안에서 인증 검사를 거치고 currentUser 값을 return 해주고 있음
         * 그 값은 req.connection.context.currentUser <- 이런식으로 담겨서 오게됨.
         * 이거를 context 라는 값으로 다시 return 해줌.
         * 근데 이게 구독 관련 기능이 아닌 다른 기능에서는(getMyProfile 과 같은 일반적인 기능들) 없는 값이기 때문에 null처리를 해줘야 함.
         */
        const { connection: { context = null } = {} } = req;
        return {
          req: req.request,
          pubSub: this.pubSub,
          context,
        };
      },
    });
    this.middleWares();
  }

  private middleWares = (): void => {
    this.app.express.use(cors());
    this.app.express.use(logger("dev"));
    this.app.express.use(helmet());
    this.app.express.use(this.jwt);
  };

  /** Custom JWT middleware 함수 */
  private jwt = async (
    req,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.get("X-JWT");
    if (token) {
      const user = await decodeJWT(token);
      if (user) {
        req.user = user;
      } else {
        req.user = undefined;
      }
    }
    next();
  };
}

export default new App().app;
