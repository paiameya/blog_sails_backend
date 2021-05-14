/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
    authorDetails: async function (req, res) {
        try {
            let { id } = req.params
            let responseObj = {}
            if (id) {
                let authorDetails = await User.findOne({ where: { id: id }, select: ['name', 'email'] }).populate('profile')
                if (authorDetails) {
                    let title = authorDetails.profile?.title || null
                    let profilePicture = authorDetails.profile?.profilePicture || null
                    delete authorDetails.profile
                    responseObj = { ...authorDetails, title, profilePicture }
                    res.status(200).send(responseObj)
                }
                else {
                    res.status(409).send("Author not found")
                }
            }
        }
        catch (err) {
            console.log("err", err)
            res.status(500).json("Something went wrong")
        }
    }
};
