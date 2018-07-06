// https://classroom.udacity.com/courses/ud666-cn-2/lessons/8ee6dbed-7b9b-46fc-a127-c2044aec7378/concepts/c233860f-5283-424a-ab68-488934b93a5d
const DB = require('../utils/db.js')
module.exports = {
  /**
   * 拉取商品列表
   * 
   */
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM product;")
  },

  detail: async ctx => {
    let productId = +ctx.params.id
    let product

    if (!isNaN(productId)) {
      product = (await DB.query('select * from product where product.id = ?', [productId]))[0]
    } else {
      product = {}
    }

    /**
     *  商品评论列表时新增的两行语句
     */
    product.commentCount = (await DB.query('SELECT COUNT(id) AS comment_count FROM comment WHERE comment.product_id = ?', [productId]))[0].comment_count || 0
    product.firstComment = (await DB.query('SELECT * FROM comment WHERE comment.product_id = ? LIMIT 1 OFFSET 0', [productId]))[0] || null
    /** */

    ctx.state.data = product
  }
}