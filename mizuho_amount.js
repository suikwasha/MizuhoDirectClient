var MIZUHO_DIRECT_URL_ENTER_USERID = "https://web.ib.mizuhobank.co.jp/servlet/mib?xtr=Emf00000";

/**
 Emf00000 => ユーザーID入力画面
 Emf00100 => 合言葉確認画面
 Emf00005 => パスワード入力画面
**/

var casper = require('casper').create();
var configFile = require('fs').read('./config.json');
var config = JSON.parse(configFile);

casper.start(MIZUHO_DIRECT_URL_ENTER_USERID);

/**
  ユーザーIDの入力
**/
casper.then(function() {
 this.fill('form', {KeiyakuNo: config.userid}, true);
});

/**
 合言葉画面ではない場合, パスワード入力画面にスキップする.
**/
casper.thenBypassIf(function() {
  this.getCurrentUrl().indexOf("Emf000100") == -1;
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

  this.fill('form', {rskAns: config.questions[q]}, true);
});

/**
 login
**/
casper.then(function() {
  this.fill('form', {Anshu1No: config.password}, true);
});

/**
  現在残高を取得して表示
**/
casper.then(function() {
 var amount = this.evaluate(function() {
  var elems = document.querySelectorAll('div[style="font-size:9pt"]');
  for(var i = 0;i < elems.length;i ++){
   if(elems[i].innerHTML.indexOf("現在残高") != -1){
    return elems[i+1].innerHTML.replace(/\D/g, "");
   }
  }
  return "-1";
 });
 this.echo(amount);
});

/**
  ログアウト
**/
casper.thenOpen("https://web1.ib.mizuhobank.co.jp/servlet/mib?xtr=EmfLogOff&NLS=JP");

casper.run(function(){
 casper.exit();
});

