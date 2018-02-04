# Cheddr

Cheddr is a Bitcoin Cash Point Of Sale system that runs in most modern browsers - no server infrastructure required!

To be lightning fast we accept zero-confirmation transactions - most payments completed within 2 seconds!

The online version is available at: https://pos.cheddr.cash/

# Features

- Simple to use for you and your customers: QR codes generated with total amount 
- Servers not required: runs entirely in your browser
- No private keys: your private data is never stored or transmitted
- cashaddr address format: legacy addresses are automatically converted for your safety and convenience
- Multiple fiat currencies: exchange rate updated periodically

Supported Currencies: 
> AUD, BRL, CAD, CHF, CLP, CNY, CZK, DKK, EUR, GBP, HKD, HUF, IDR, ILS, INR, JPY, KRW, MXN, MYR, NOK, NZD, PHP, PKR, PLN, USD, RUB, SEK, SGD, THB, TRY, TWD, ZAR

# Safety Concerns

- Bitcoin Cash 0-conf is 200% faster than Visa 
- Your transaction reaches 99.8% of the network in under 2 seconds
- All transactions are settled in 6 blocks (60 minutes not 60 days)
- Cost of double spend attack is estimated at USD$68,0000

When compared to something like chargeback fraud, which can be done weeks after the purchase, zero-conf is much safer and more reliable than credit cards

Bitcoin Cash intends to make zero-conf as safe and reliable as it used to be before the backlogs. As transactions are virtually guanteed to be included in the next block, it is nearly impossible for fraud to occur. 

# Notes

Cheddr only currently supports one receive address at a time however I never encountered issues as long as you aren't trying to use multiple tabs at once.

For vendors requiring multiple checkouts, I recommend generating a unique receive address for each point of sale location.

Exchange rates are taken from api.coinmarketcap.com - the updates are limited to once every 5 minutes.

Transactions are validated using blockdozer.com api which tries a maximum of 4 times with a 3 second delay between each attempt. 

# Basic Usage

For vendors that already have existing Point of Sale systems the quickest way to complete a Bitcoin Cash transaction is:

1. Press New Transaction button from main screen
2. Enter total amount using keypad
3. Press the green check-out button (no need to press the add key)
4. Show the customer the generated QR code (or copy the address for them to send to)
5. Press the confirm payment button (green tick) to start validating the transaction

# TODO

- Smart API rate limiting
- Fall back APIs
- Calculate recommended transaction fee
- Printing transaction summary
- Transaction history

# Donations

This system is being developed in my spare time, donations are gratefully accepted.

![qrcode](https://i.imgur.com/A1i7tvW.png)
bitcoincash:qze4dyv6znt5h22dxqsejvfn47tz2ermeg62y4cdg6
