var casper = require('casper').create();

var configFile = require('fs').read('./config.json');
var config = JSON.parse(configFile);

require('mizuho_login').apply(casper, config);

casper.then(function(){
  this.click('a[id="MB_R011N040"]');
});

casper.then(function() {
  var target = this.evaluate(function(accountNumber) {
    var accounts = document.querySelector('select[name="SelAcct"]').querySelectorAll('option');
    var index = "-1";
    for(var i = 0;i < accounts.length;i ++) {
      console.log(accounts[i].value);
      if(accounts[i].innerHTML.indexOf(accountNumber) != -1){
        return "" + i + "";
      } 
    }
    return "-1";
  }, config.accounts[0]);
  
  if(target == "-1"){
    this.log("error account number not found.", "error");
  }else{
    this.fill('form[name="FORM1"]', {SelAcct: target}, true);
  }
});

casper.waitForUrl(/Emf04110/);

casper.then(function() {
  var records = casper.evaluate(function(){
    var cells = document.querySelector('div#bodycontent').querySelectorAll('div[style="font-size:9pt"]');
    var index = -1;
    for(var i = 0;i < cells.length;i ++) {
      if(cells[i].innerHTML.indexOf("お取引内容") != -1) {
        index = i;
        break;
      } 
    }  
  
    if(index == -1){
      console.log("文字列 'お取引内容' が見つかりませんでした.", "error");
      return;
    }
  
    var ret = [];
    for(var i = index + 1;i + 3 < cells.length;i = i + 4) {
      var record = {
        "date": cells[i].innerHTML.replace(/\D/g, ""),
        "withdrawal": cells[i + 1].innerHTML.replace(/\D/g, ""),
        "deposit": cells[i + 2].innerHTML.replace(/\D/g, ""),
        "description": cells[i + 3].innerHTML.replace(/&nbsp;/g, "")
      };
      ret.push(record);
    }

    return ret;
  });

  require('utils').dump(records); 
});

require('mizuho_logout').apply(casper, config);

casper.run(function(){
  casper.exit();
});

