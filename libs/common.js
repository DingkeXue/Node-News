const crypro = require('crypto');

module.exports = {

  MD5_suffix: 'alsdjsa fw3jr0239024',

  md5: function (str) {
      const obj = crypro.createHash('md5');
      obj.update(str);

      return obj.digest('hex');
  }
};