/**
 * BlogController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getBlogDetails: async function (req, res) {
        //API  to fetch blogs 
        //QueryParams: category,author,sortby,sortorder,limit,offset
        //Responce : Blog list
        try {
            let { category, offset = 0, limit = 5, author, sortBy, sortOrder = "ASC" } = req.query;
            let authorId = [], categoryId = [], result, count = 0, query = {};

            if (category) {
                if (!Array.isArray(category)) {
                    category = [category.trim().toLowerCase()]
                } else {
                    category = category.map(item => item.trim().toLowerCase())
                }
                let categoryItem = await Category.find({ name: { in: category } })
                categoryId = categoryItem.map(item => item.id)
                query = { ...query, categoryId: { in: categoryId } }
            }

            if (author) {
                if (!Array.isArray(author)) {
                    author = [author.trim().toLowerCase()]
                }
                else {
                    author = author.map(item => item.trim().toLowerCase())
                }
                const userItem = await User.find({ name: { in: author } })
                authorId = userItem.map(item => item.id)
                query = { ...query, authorId: { in: authorId } }
            }
            count = await Blog.count(query)
            result = await Blog.find(query).skip(offset).limit(limit)

            if (!result) { throw 'notFound'; }
            return res.status(200).json({ results: result, count: count });
        }
        catch (err) {
            return res
                .status(500)
                .send(
                    'We are currently unable to process your request. Please try after sometime.'
                )
        }
    }
};

