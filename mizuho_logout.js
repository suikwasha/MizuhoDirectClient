
module.exports = {
  apply: function(casper, config) {
    casper.thenOpen("https://web1.ib.mizuhobank.co.jp/servlet/mib?xtr=EmfLogOff&NLS=JP");
  }
}
