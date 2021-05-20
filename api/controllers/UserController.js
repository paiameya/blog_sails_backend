/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  authorDetails: async function (req, res) {
    try {
      const { id } = req.params;
      let responseObj = {};
      if (id) {
        const authorDetails = await User.findOne({
          where: { id: id },
          select: ['name', 'email']
        }).populate('profile');
        if (authorDetails) {
          const bio = authorDetails.profile?.bio || null;
          const profilePicture = authorDetails.profile?.profilePicture || null;
          delete authorDetails.profile;
          responseObj = { ...authorDetails, bio, profilePicture };
          res.status(200).send(responseObj);
        } else {
          res.status(404).send('Author not found');
        }
      }
    } catch (err) {
      sails.log('err', err);
      res.status(500).json('Something went wrong');
    }
  }
};
