/**
 * CommentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const sanitizeHtml = require('sanitize-html');
const Filter = require('bad-words');
module.exports = {
  getComments: async function (req, res) {
    try {
      const { id } = req.params;
      const { offset = 0, limit = 10 } = req.query;
      if (id) {
        const comments = await Comment.find({ blogId: id })
          .sort('createdAt DESC')
          .skip(offset)
          .limit(limit);
        const count = await Comment.count({ blogId: id });
        if (!comments) {
          res.status(400).send('No Comments Found');
        }
        const commenterId = comments.map(item => item.userId);
        const uniqueCommenter = [...new Set(commenterId)];
        const commenterDetails = await User.find({
          id: { in: uniqueCommenter }
        }).populate('profile');
        const userIds = commenterDetails
          .map(item => ({
            [item.id]: item.name
          }))
          .reduce((a, b) => ({ ...a, ...b }), {});
        if (Object.keys(userIds).length) {
          const result = comments.map(item => ({
            date: item.createdAt,
            message: item.text,
            profilePicture: item.profilePicture,
            user: userIds[item.userId]
          }));
          res.status(200).send({ count, result });
        } else {
          res
            .status(400)
            .send('Data Issue.Check the Commenter is registered user or not');
        }
      }
    } catch (err) {
      console.log('*****err****', err);
      res.status(500).send(err);
    }
  },

  postComment: async function (req, res) {
    try {
      let result = {};
      const { id } = req.params;
      if (!req.me) {
        res.status(400).send('User is not authenticated');
      }
      if (req.body) {
        if (req.body.text) {
          filter = new Filter();
          const sanitizedComment = sanitizeHtml(filter.clean(req.body.text), {
            allowedTags: []
          });
          result = { userId: req.me.id, blogId: id, text: sanitizedComment };
        } else res.status(400).send('No comments Added');
        res.status(200).send(result);
      } else {
        res.status(400).send('No comments Added');
      }
    } catch (err) {
      console.log('*****err****', err);
      res.status(500).send(err);
    }
  }
};
