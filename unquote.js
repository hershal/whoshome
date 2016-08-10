module.exports = function unquote(str, delim) {
  if (!str) {
    return '';
  }

  let reg;
  if (typeof delim !== 'string') {
    delim = '\'\"';
  }

  reg = new RegExp(`[${delim}]`);

  if (reg.test(str.charAt(0))) {
    str = str.substr(1);
  }

  if (reg.test(str.charAt(str.length - 1))) {
    str = str.substr(0, str.length - 1);
  }

  return str;
};
