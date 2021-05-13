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
        const { category, offset = 0, limit = 5, author, sortBy, sortOrder = "ASC" } = req.query;
        let userId, categoryId, result;
        if (category) {
            const queryCategory = await Category.find({ name: category });
            categoryId = queryCategory.flatMap(eachCategory => eachCategory.id);
        }
        if (author) {
            const queryAuthor = await User.find({ name: author });
            userId = queryAuthor.flatMap(eachAuthor => eachAuthor.id)
        }

        if (sortBy)
            result = await Blog.find({ 'category': categoryId, 'user': userId }).skip(offset).limit(limit).sort(`${sortBy} ${sortOrder}`)
        else
            result = await Blog.find({ 'category': categoryId, 'user': userId }).skip(offset).limit(limit)

        if (!result) { throw 'notFound'; }

        return res.status(200).json({ responce: result });
    }
};