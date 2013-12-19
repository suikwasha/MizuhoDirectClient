
module.exports = {
  apply: function(casper, config) {
    var url = "https://web.ib.mizuhobank.co.jp/servlet/mib?xtr=Emf00000";
  
    casper.start(url);
  
    casper.then(function() {
      this.fill('form', {KeiyakuNo: config.userid}, true);
    });
  
    casper.thenBypassIf(function() {
      return this.getCurrentUrl().indexOf("Emf00100") == -1;
    }, 2);
  
    casper.repeat(2, function() {
      var text = this.fetchText('div');
      var q = '';
      Object.keys(config.questions).forEach(function(key) {
        if(text.indexOf(key) != -1){
          q = key;
        }
      });
  
      // <input type="checkbox" name="rskPCResistCHK" value="CHECK">
      if(document.querySelector('input[name="rskPCResistCHK"]') != null) {
        this.fill('form', {rskAns: config.questions[q], rskPCResistCHK: true}, true);
      }else{
        this.fill('form', {rskAns: config.questions[q]}, true);
      }
    });
  
    casper.then(function() {
      this.fill('form', {Anshu1No: config.password}, true);
    });
  
  
    casper.waitForUrl(/Emf02000/);
  }
}
