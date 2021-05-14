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
            if (id) {
                let authorDetails = await User.find({ where: { id: id }, select: ['name', 'email'] }).populate('profile')
                if (authorDetails) {
                    delete authorDetails[0].salt
                    res.status(200).send(authorDetails[0])
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
