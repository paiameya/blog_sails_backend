/**
 * LikeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
    getTotalLikesForBlog: async function (req, res) {
        try {
            const { id } = req.params
            const thumbupCount = await Like.count({ blogId: id, review: 1 })
            const thumbdownCount = await Like.count({ blogId: id, review: -1 })
            res.send({ thumbupCount, thumbdownCount })
        }
        catch (err) {
            sails.log("error", err);
            res.status(500).send(err)
        }
    },
    getUserLikes: async function (req, res) {
        try {
            const { id, userId } = req.params
            const userLikes = await Like.findOne({ where: { blogId: id, userId: userId }, select: ['review'] })
            if (userLikes.review) {
                res.status(200).send(userLikes.review === 1 ? "thumbs up" : userLikes.review === 0 ? "not rated(removed the rating)" : "thumbs down")
            }
            else
                res.status(200).send("not rated")

        }
        catch (err) {
            console.log("error", err);
            res.status(500).send(err)
        }
    },
    putLikes: async function (req, res) {
        try {
            const { review } = req.body;
            const { id, userId } = req.params;
            if (!([1, 0, -1].includes(review)))
                return res.status(400).send("invalid review provided")

            await Like.findOrCreate({ blogId: id, userId: userId }, { blogId: id, userId, review: review })
                .exec(async (err, like, wasCreated) => {
                    if (err) { return res.serverError(err); }

                    if (wasCreated) {
                        if (like.review === 1) {
                            const blog = await Blog.findOne({ id })
                            await Blog.update({ id }).set({ likeCount: blog.likeCount + 1 });
                        }
                        res.status(200).send(like)
                    }
                    else {
                        if (like.review != review) {
                            let inc = 0
                            if (like.review === 1)
                                inc = -1
                            else
                                if (review === 1)
                                    inc = 1
                            const blog = await Blog.findOne({ id })
                            await Blog.update({ id }).set({ likeCount: blog.likeCount + inc });
                        }
                        const updatedReview = await Like.updateOne({ blogId: id, userId: userId }).set({ review: review });
                        res.status(200).send(updatedReview)
                    }
                });
        }

        catch (err) {
            sails.log(err);
            res.status(500).send(err)
        }
    }

};

