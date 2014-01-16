MizuhoDirectClient using CasperJS
===================================

## Requirements
1. CasperJS >= 1.11-beta3

## usage
1. rename `config.json.template` to `config.json`
2. open `config.json` and fill your
 1. secret questions and their answers
 2. username
 3. password
 4. accounts (account number)

#### mizuho_balance.js
3. execute `casperjs mizuho_balance.js`

#### mizuho_statement.js
3. execute `casperjs mizuho_statement.js`
 - you can specify range like below
   `casperjs mizuho_statement.js "2013/12/31" "2014/1/10"`
