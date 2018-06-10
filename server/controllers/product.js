// https://classroom.udacity.com/courses/ud666-cn-2/lessons/8ee6dbed-7b9b-46fc-a127-c2044aec7378/concepts/c233860f-5283-424a-ab68-488934b93a5d
const DB = require('../utils/db.js')

module.exports = {
  /**
   * 拉取商品列表
   * 
   */

  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM product;")
  }, // 为什么这里要赋值给 state.data

  detail: async ctx => {
    let productId = + ctx.params.id

    if (!isNaN(productId)) {
      ctx.state.data = (await DB.query('select * from product where product.id = ?', [productId]))[0]
    } else {
      ctx.state.data = {}
    }

  }
}