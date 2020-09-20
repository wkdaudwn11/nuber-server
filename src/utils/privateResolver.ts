const privateResolver = (resolverFunction) => async (
  parent,
  args,
  context,
  info
) => {
  if (!context.req.user) {
    throw new Error("로그인 토큰이 없습니다.");
  }
  const resolved = await resolverFunction(parent, args, context, info);
  return resolved;
};

export default privateResolver;
