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
      const { id } = req.params;
      let author = {};
      let name = null;
      let profilePic = null;
      if (id) {
        const blog = await Blog.findOne({
          where: { id: id },
          select: [
            'id',
            'title',
            'image',
            'content',
            'publishedDate',
            'likeCount'
          ]
        })
          .populate('authorId')
          .populate('categoryId');

        if (blog) {
          const authorId = blog.authorId.id;

          const blogAuthor = await User.findOne({
            where: { id: authorId },
            select: ['name']
          }).populate('profile');
          if (blogAuthor !== null) {
            name = blogAuthor.name || null;
            profilePic = blogAuthor.profile?.profilePicture || null;
            author = { id: authorId, name, profilePic };
          }
          if (blog.categoryId !== null) {
            category = blog.categoryId;
            responseObj = { ...responseObj };
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
      sails.log('*****err****', err);
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
        search = ''
      } = req.query;
      let authorId = [];
      let categoryId = [];
      let count = 0;
      let query = {};
      let sortQuery = {};
      if (category) {
        if (!Array.isArray(category)) {
          category = [category.trim().toLowerCase()];
        } else {
          category = category.map(item => item.trim().toLowerCase());
        }
        const categoryItem = await Category.find({ name: { in: category } });
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
      }
      count = await Blog.count({
        where: { ...query, title: { contains: search } }
      });

      const result = await Blog.find({
        where: { ...query, title: { contains: search }, },
        ...sortQuery
      }).meta({ makeLikeModifierCaseInsensitive: true })
        .populate('like', { where: { review: 1 } })
        .populate('categoryId')
        .skip(offset)
        .limit(limit)
        .then(blogs => {
          blogs.forEach(blog => {
            blog.likes = blog.like.length;
            delete blog.like;
          });
          return blogs;
        });


      const users = [...new Set(result.map(b => b.authorId))];
      let authorList = await User.find({ id: { in: users } }).populate(
        'profile'
      );
      authorList = authorList
        .map(_user => ({
          [_user.id]: {
            name: _user.name,
            profilePic: _user.profile?.profilePicture
          }
        }))
        .reduce((a, b) => ({ ...a, ...b }), {});
      result.forEach(blog => {
        blog.author = authorList[blog.authorId];
      });
      if (!result) {
        throw new Error('notFound');
      }
      return res.status(200).send({ result, count });
    } catch (err) {
      sails.log(err);
      return res
        .status(500)
        .send(
          'We are currently unable to process your request. Please try after sometime.'
        );
    }
  }
};
