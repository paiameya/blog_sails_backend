/**
 * BlogController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getBlogDetails: async function (req, res) {
        const { category, offset = 0, limit = 3, author } = req.query;
        let userId, categoryId;
        if (category) {
            const queryCategory = await Category.find({ name: category });
            categoryId = queryCategory.flatMap(eachCategory => eachCategory.id);
        }
        if (author) {
            const queryAuthor = await User.find({ name: author });
            userId = queryAuthor.flatMap(eachAuthor => eachAuthor.id)
        }

        const result = await Blog.find({ 'category': categoryId, 'user': userId }).skip(offset).limit(limit)

        if (!result) { throw 'notFound'; }

        return res.status(200).json({ responce: result });
    }
};