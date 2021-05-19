module.exports = async function (req, res, proceed) {
    let token = req.get("authorization")
    if (token === undefined) return res.forbidden();

    let session = await Session.find({ sessionToken: token, status: 1 }).populate('user')
    if (session && session.length && session[0].user !== null) {

        if (session[0].expiresAt > Date.now()) {
            req.me = session[0].user
            req.sessionToken = token
            return proceed();
        }
        let session = await Session.update({ sessionToken: token, status: 1 }).set({ status: 0 })
        return res.forbidden()
    }
    return res.forbidden();
};
