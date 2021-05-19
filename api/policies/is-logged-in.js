module.exports = async function (req, res, proceed) {
    let token = req.get("authorization")
    console.log("token", token)
    if (token === undefined) return res.forbidden();
    let session = await Session.find({ sessionToken: token, status: 1 }).populate('user')
    console.log("session", session)
    if (session && session.length && session.user !== null) {
        req.me = session.user
        req.sessionToken = token
        return proceed();
    }
    return res.forbidden();
};
