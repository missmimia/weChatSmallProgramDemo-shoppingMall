// 登录授权接口
module.exports = async (ctx, next) => {
  // 通过 Koa 中间件进行登录之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：
  if (ctx.state.$wxInfo.loginState) {
    ctx.state.data = ctx.state.$wxInfo.userinfo
    ctx.state.data['time'] = Math.floor(Date.now() / 1000)
  } else {
    //  mi:参考课程链接https://classroom.udacity.com/courses/ud666-cn-2/lessons/6ce3fb4a-9d45-48aa-b66c-9faea2c6b9ee/concepts/19b299a6-36ba-4f6e-a782-4723e20c8e06
    ctx.state.code = -1
  }
}
