import Chat from "../../../entities/Chat";
import User from "../../../entities/User";
import { GetChatQueryArgs, GetChatResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Query: {
    GetChat: privateResolver(
      async (_, args: GetChatQueryArgs, { req }): Promise<GetChatResponse> => {
        const user: User = req.user;
        try {
          const chat = await Chat.findOne(
            {
              id: args.chatId,
            },
            { relations: ["messages"] }
          );
          if (chat) {
            if (chat.passengerId === user.id || chat.driverId === user.id) {
              return {
                ok: true,
                error: null,
                chat,
              };
            } else {
              return {
                ok: false,
                error: "해당 채팅방에 대한 접근 권한이 없습니다.",
                chat: null,
              };
            }
          } else {
            return {
              ok: false,
              error: "조회된 채팅방이 없습니다.",
              chat: null,
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            chat: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
