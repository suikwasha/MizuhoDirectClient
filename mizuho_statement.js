var MIZUHO_DIRECT_URL_ENTER_USERID = "https://web.ib.mizuhobank.co.jp/servlet/mib?xtr=Emf00000";

var casper = require('casper').create();

var configFile = require('fs').read('./config.json');
var config = JSON.parse(configFile);

casper.start(MIZUHO_DIRECT_URL_ENTER_USERID);

/**
  ユーザーIDの入力
**/
casper.then(function() {
  var me = this;
  this.page.onConsoleMessage = function(msg, line, source) {
    me.log(msg, 'debug');
  }
  this.fill('form', {KeiyakuNo: config.userid}, true);
});

/**
 合言葉画面ではない場合, パスワード入力画面にスキップする.
**/
casper.thenBypassIf(function() {
  return this.getCurrentUrl().indexOf("Emf00100") == -1;
}, 2);

/**
 合言葉を2回入力する.
**/
casper.repeat(2, function(){
  var text = this.fetchText('div');
  var q = '';
  Object.keys(config.questions).forEach(function(key){
    if(text.indexOf(key) != -1){
      q = key;
    }
  });

  // <input type="checkbox" name="rskPCResistCHK" value="CHECK">
  if(document.querySelector('input[name="rskPCResistCHK"]') != null){
    this.fill('form', {rskAns: config.questions[q], rskPCResistCHK: true}, true);
  }else{
    this.fill('form', {rskAns: config.questions[q]}, true);
  }
});

/**
 login
**/
casper.then(function() {
  this.fill('form', {Anshu1No: config.password}, true);
});

casper.waitForUrl(/Emf02000/);

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

/**
  ログアウト
**/
casper.thenOpen("https://web1.ib.mizuhobank.co.jp/servlet/mib?xtr=EmfLogOff&NLS=JP");

casper.run(function(){
  casper.exit();
});

