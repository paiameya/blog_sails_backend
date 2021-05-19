module.exports = async function (req, res, proceed) {
    let token = req.get("authorization")
    if (token === undefined) return res.forbidden();

    let session = await Session.find({ sessionToken: token, status: 1 }).populate('user')

    if (session && session.length && session.user !== null) {
        if (session[0].expiresAt > Date.now()) {
            req.me = session.user
            req.sessionToken = token
            return proceed();
        }
        return res.forbidden();

    }
    return res.forbidden();
};
