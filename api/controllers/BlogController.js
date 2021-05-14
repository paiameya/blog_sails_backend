/**
 * BlogController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */



module.exports = {
    blogDetails: async function (req, res) {
        try {
            let responseObj = {}
            let { id } = req.params
            let author = {}

            let name = null
            let profilePic = null
            let categoryName = null
            if (id) {
                let blog = await Blog.findOne({ where: { id: id }, select: ['id', 'title', 'image', 'content', 'likes', 'publishedDate'] }).populate('authorId').populate('categoryId')

                if (blog) {
                    let authorId = blog.authorId?.id

                    let blogAuthor = await User.findOne({ where: { id: authorId }, select: ['name'] }).populate('profile')

                    if (blogAuthor !== null) {

                        name = blogAuthor.name || null
                        profilePic = blogAuthor.profile?.profilePicture || null
                        author = { name, profilePic }

                    }
                    if (blog.categoryId !== null) {

                        category = blog.categoryId.name
                        responseObj = { ...responseObj, categoryName }
                    }
                    delete blog.authorId
                    delete blog.categoryId
                    responseObj = { ...blog, author, category }
                    res.status(200).send(responseObj)


                }
                else {
                    res.status(404).send("Blog not found")
                }
            }

        }
        catch (err) {
            console.log("*****err****", err)
            res.status(500).send("something went wrong")
        }
    }
};
