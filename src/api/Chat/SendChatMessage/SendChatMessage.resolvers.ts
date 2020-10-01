import Chat from "../../../entities/Chat";
import Message from "../../../entities/Message";
import User from "../../../entities/User";
import {
  SendChatMessageMutationArgs,
  SendChatMessageResponse,
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    SendChatMessage: privateResolver(
      async (
        _,
        args: SendChatMessageMutationArgs,
        { req }
      ): Promise<SendChatMessageResponse> => {
        const user: User = req.user;
        try {
          const chat = await Chat.findOne({ id: args.chatId });
          if (chat) {
            if (chat.passengerId === user.id || chat.driverId === user.id) {
              const message = await Message.create({
                text: args.text,
                chat,
                user,
              }).save();
              return {
                ok: true,
                error: null,
                message,
              };
            } else {
              return {
                ok: false,
                error: "해당 채팅방에 대한 접근 권한이 없습니다.",
                message: null,
              };
            }
          } else {
            return {
              ok: false,
              error: "조회된 채팅방이 없습니다.",
              message: null,
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            message: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
