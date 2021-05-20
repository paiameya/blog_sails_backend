/**
 * LikeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getTotalLikesForBlog: async function (req, res) {
    try {
      const { id } = req.params;
      const thumbupCount = await Like.count({ blogId: id, review: 1 });
      const thumbdownCount = await Like.count({ blogId: id, review: -1 });
      res.send({ thumbupCount, thumbdownCount });
    } catch (err) {
      sails.log('error', err);
      res.status(500).send(err);
    }
  },
  getUserLikes: async function (req, res) {
    try {
      const { id, userId } = req.params;
      const userLikes = await Like.findOne({
        where: { blogId: id, userId: userId },
        select: ['review']
      });
      if (userLikes?.review) {
        res
          .status(200)
          .send(
            userLikes.review === 1
              ? 'thumbs up'
              : userLikes.review === 0
              ? 'not rated(removed the rating)'
              : 'thumbs down'
          );
      } else res.status(200).send('not rated');
    } catch (err) {
      sails.log('error', err);
      res.status(500).send(err);
    }
  },
  putLikes: async function (req, res) {
    try {
      const { review } = req.body;
      const { id } = req.params;
      const userId = req.me.id;
      if (![1, 0, -1].includes(review)) {
        return res.status(400).send('invalid review provided');
      }
      let like = await Like.findOne({ blogId: id, userId: userId });

      const blog = await Blog.findOne({ id });
      let likeCount = blog.likeCount || 0;
      if (!like) {
        like = await Like.create({ blogId: id, userId: userId, review });
        if (review === 1) likeCount++;
      } else {
        if (like.review !== review) {
          if (review === 1) likeCount++;
          else if (like.review === 1) likeCount--;
          await Like.update({ id: like.id }).set({ review });
        }
      }
      if (likeCount !== blog.likeCount) {
        await Blog.update({ id }).set({ likeCount });
      }

      res.status(200).send({ like, blog: await Blog.findOne({ id }) });
    } catch (err) {
      sails.log(err);
      res.status(500).send(err);
    }
  }
};
