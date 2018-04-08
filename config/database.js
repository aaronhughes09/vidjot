if(process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 
    'mongodb://Aaron:aaron@ds239359.mlab.com:39359/vidjot-prod'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}