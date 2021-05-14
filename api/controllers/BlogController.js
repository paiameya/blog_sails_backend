/**
 * BlogController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getBlogDetails: async function (req, res) {
    try {
      let responseObj = {};
      let { id } = req.params;
      let author = {};

      let name = null;
      let profilePic = null;
      let categoryName = null;
      if (id) {
        let blog = await Blog.findOne({
          where: { id: id },
          select: ['id', 'title', 'image', 'content', 'likes', 'publishedDate'],
        })
          .populate('authorId')
          .populate('categoryId');

        if (blog) {
          let authorId = blog.authorId.id;

          let blogAuthor = await User.findOne({
            where: { id: authorId },
            select: ['name'],
          }).populate('profile');

          if (blogAuthor !== null) {
            name = blogAuthor.name || null;
            profilePic = blogAuthor.profile.profilePicture || null;
            author = { name, profilePic };
          }
          if (blog.categoryId !== null) {
            category = blog.categoryId.name;
            responseObj = { ...responseObj, categoryName };
          }
          delete blog.authorId;
          delete blog.categoryId;
          responseObj = { ...blog, author, category };
          res.status(200).send(responseObj);
        } else {
          res.status(404).send('Blog not found');
        }
      }
    } catch (err) {
      console.log('*****err****', err);
      res.status(500).send('something went wrong');
    }
  },
  getBlogList: async function (req, res) {
    try {
      let {
        category,
        offset = 0,
        limit = 5,
        author,
        sortBy,
        sortOrder = 'DESC',
      } = req.query;
      let authorId = [],
        categoryId = [],
        result,
        count = 0,
        query = {},
        sortQuery = {};

      if (category) {
        if (!Array.isArray(category)) {
          category = [category.trim().toLowerCase()];
        } else {
          category = category.map(item => item.trim().toLowerCase());
        }
        let categoryItem = await Category.find({ name: { in: category } });
        categoryId = categoryItem.map(item => item.id);
        query = { ...query, categoryId: { in: categoryId } };
      }

      if (author) {
        if (!Array.isArray(author)) {
          author = [author.trim().toLowerCase()];
        } else {
          author = author.map(item => item.trim().toLowerCase());
        }
        const userItem = await User.find({ name: { in: author } });
        authorId = userItem.map(item => item.id);
        query = { ...query, authorId: { in: authorId } };
      }
      if (sortBy) {
        sortBy = sortBy.trim();
        sortQuery = { sort: `${sortBy} ${sortOrder}` };
        console.log('sortQuery', sortQuery);
      }
      count = await Blog.count(query);
      result = await Blog.find({ where: query, ...sortQuery })
        .skip(offset)
        .limit(limit);

      if (!result) {
        throw 'notFound';
      }
      return res.status(200).send({ result, count });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send(
          'We are currently unable to process your request. Please try after sometime.'
        );
    }
  },
};
