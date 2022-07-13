const Cookies = require('js-cookie');

module.exports = {
  getCookie: async (cookiename, cookiestring) => {
    var name = cookiename + '=';
    var decodedCookie = decodeURIComponent(cookiestring);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  },
  setCookie: (cookiename, cookievalue) => {
    Cookies.set(cookiename, cookievalue, { expires: 365 });
  }
};
