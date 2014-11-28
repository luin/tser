function ResponseError(reject) {
  this.name = 'ResponseError';
  this.message = '';
  this.reject = reject;
}
ResponseError.prototype = new Error();

module.exports = ResponseError;
