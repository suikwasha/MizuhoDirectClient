
var casper = require('casper').create();

var configFile = require('fs').read('./config.json');
var config = JSON.parse(configFile);

require('mizuho_login').apply(casper, config);

casper.then(function() {
  var amount = this.evaluate(function() {
    var elems = document.querySelectorAll('div[style="font-size:9pt"]');
    for(var i = 0;i < elems.length;i ++) {
      if(elems[i].innerHTML.indexOf("現在残高") != -1) {
        return elems[i+1].innerHTML.replace(/\D/g, "");
      }
    }

    return "-1";
  });

  require("utils").dump({"balance": "" + amount + ""});
});

require('mizuho_logout').apply(casper, config);

casper.run(function(){
  this.exit();
});
