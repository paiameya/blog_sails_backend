module.exports = async function (req, res, proceed) {
    let token = req.get("authorization")
    if (token === undefined) return res.forbidden();
    let session = await Session.findOne({ sessionToken: token, status: 1 }).populate('user')
    if (session && session.user !== null) {
        if (session.expiresAt > Date.now()) {
            req.me = session.user
            req.sessionToken = token
            return proceed();
        }
        res.forbidden()

    }
    return res.forbidden();
};
