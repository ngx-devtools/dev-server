module.exports = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Authorization, Accept');
  next();
};