
var casper = require('casper').create();

var configFile = require('fs').read('./config.json');
var config = JSON.parse(configFile);

require('mizuho_login').apply(casper, config);

casper.then(function(){
  this.click('a[id="MB_R011N030"]');
});

casper.then(function(){
  var accountsCount = this.evaluate(function(){
    var accountsTable = document.querySelector('table#Table10'); 
    var accountsCount = accountsTable.querySelectorAll('input[type="checkbox"]').length;
    return accountsCount;
  });  
  
  var parameters = {};
  for(var i = 0;i < accountsCount;i ++){
    parameters["SelectChk" + i] = true;
  }

  this.fill('form', parameters, true);
});

casper.waitForUrl(/Emf03010/);

casper.then(function(){
  var accounts = this.evaluate(function(){
    var accounts = document.querySelectorAll('table[width="350"][bgcolor="#7A6AA9"][border="0"][cellpadding="2"][cellspacing="1"]');

    var ret = [];
    for(var i = 0;i < accounts.length;i ++){
      var elements = accounts[i].querySelectorAll('tr > td[width="200"] > div');

      var detail = {
        name: elements[0].innerHTML.replace(/&nbsp;/g, ""),
        type: elements[1].innerHTML.replace(/&nbsp;/g, ""),
        accountNumber: elements[2].innerHTML.replace(/&nbsp;/g, ""),
        total: elements[3].innerHTML.replace(/\D/g, ""),
        balance: elements[4].innerHTML.replace(/\D/g, "")
      };

      ret.push(detail);
    }

    return ret;
  });

  require('utils').dump(accounts);
});

require('mizuho_logout').apply(casper, config);

casper.run(function(){
  this.exit();
});
