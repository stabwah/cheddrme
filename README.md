# Cheddr

Cheddr is a Bitcoin Cash Point Of Sale system that runs in most modern browsers (no server infrastructure required).

To be lightning fast we accept zero-confirmation transactions (most payments completed within 2 seconds!).

The online version is available at: https://pos.cheddr.cash/

Supported Currencies: 
> BRL, CAD, CHF, CLP, CNY, CZK, DKK, EUR, GBP, HKD, HUF, IDR, ILS, INR, JPY, KRW, MXN, MYR, NOK, NZD, PHP, PKR, PLN, USD, RUB, SEK, SGD, THB, TRY, TWD, ZAR

# Features

- Simple to use
- Servers not required: runs entirely in your browser
- No private keys: your private data is never stored or transmitted
- cashaddr address format: legacy addresses are automatically converted for your safety and convenience
- Multiple fiat currencies: exchange rate updated periodically
- Settings saved using HTML5 local storage

# Safety Concerns

- Bitcoin Cash 0-conf is 200% faster than Visa 
- Your transaction reaches 99.8% of the network in under 2 seconds
- All transactions are settled in 6 blocks (60 minutes not 60 days)
- Cost of double spend attack is estimated at USD$68,0000

When compared to something like chargeback fraud, which can be done weeks after the purchase, zero-conf is much safer and more reliable than credit cards

Bitcoin Cash intends to make zero-conf as safe and reliable as it used to be before the backlogs. As transactions are virtually guanteed to be included in the next block, it is nearly impossible for fraud to occur. 

# Usage

Cheddr only currently supports one recieve address at a time however I never encountered issues as long as you aren't trying to use multiple tabs at once.

For vendors requiring multiple checkouts, I recommend generating a unique recieve address for each point of sale location.

# TODO

- Retry API on failure
- Fall back to multiple APIs
- Calculate transaction fee
- History of transactions
- Generate recieve addresses for user

# Donations

This system is being developed in my spare time, donations are gratefully accepted.

![qrcode](https://i.imgur.com/A1i7tvW.png)
bitcoincash:qze4dyv6znt5h22dxqsejvfn47tz2ermeg62y4cdg6
