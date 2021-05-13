/**
 * BlogController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Category = require("../models/Category");

module.exports = {
    getBlogDetails: async function (req, res) {
        //API  to fetch blogs 
        //QueryParams: category,author,sortby,sortorder,limit,offset
        //Responce : Blog list
        try {
            let { category, offset = 0, limit = 5, author, sortBy, sortOrder = "ASC" } = req.query;
            let userId, categoryId = [], result;
            console.log("...category", category)
            if (category && !Array.isArray(category)) { category = [category] }
            console.log("category...", category)
            if (category) {

                categoryItem = await Category.find({ name: "life" })
                console.log(categoryItem, "something")
                for (const eachCategory of category) {
                    console.log("coming inside")

                    categoryId.push(categoryItem.id)
                    console.log(categoryId, "categoryId5")
                }
                console.log(categoryId, "categoryIds")

                // categoryId = queryCategory.flatMap(eachCategory => eachCategory.id);
            }

            if (author) {
                const queryAuthor = await User.find({ name: author });
                userId = queryAuthor.flatMap(eachAuthor => eachAuthor.id)
            }

            if (sortBy)
                result = await Blog.find({ 'category': { in: categoryId }, 'user': userId }).skip(offset).limit(limit).sort(`${sortBy} ${sortOrder}`)
            else
                result = await Blog.find({ 'category': { in: categoryId }, 'user': userId }).skip(offset).limit(limit)

            if (!result) { throw 'notFound'; }

            return res.status(200).json({ responce: result });
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