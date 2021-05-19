module.exports = async function (req, res, proceed) {
  const token = req.get('authorization');
  if (token === undefined) return res.forbidden();
  const session = await Session.findOne({
    sessionToken: token,
    status: 1
  }).populate('user');
  if (session && session.user !== null) {
    req.me = session.user;
    req.sessionToken = token;
    return proceed();
  }
  return res.forbidden();
};
