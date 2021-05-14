module.exports = async function (req, res, proceed) {
    let token = req.get("authorization")
    if (token === undefined) return res.forbidden();
    let session = await Session.findOne({ sessionToken: token, status: 1 }).populate('user')
    if (session && session.user !== null) {
        return proceed();
    }
    return res.forbidden();
};
