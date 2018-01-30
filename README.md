# Cheddr

Cheddr is a Bitcoin Cash Point Of Sale system that runs in most modern browsers (no server infrastructure required).

To be lightning fast, we accept zero-confirmation transactions.

Supported Currencies: 
> BRL, CAD, CHF, CLP, CNY, CZK, DKK, EUR, GBP, HKD, HUF, IDR, ILS, INR, JPY, KRW, MXN, MYR, NOK, NZD, PHP, PKR, PLN, USD, RUB, SEK, SGD, THB, TRY, TWD, ZAR

# Safety Concerns

- Bitcoin Cash 0-conf is 200% faster than Visa 
- Your transaction reaches 99.8% of the network in under 2 seconds
- All transactions are settled in 6 blocks (60 minutes not 60 days)
- Cost of double spend attack is estimated at USD$68,0000

When compared to something like chargeback fraud, which can be done weeks after the purchase, zero-conf is much safer and more reliable than credit cards

Bitcoin Cash intends to make zero-conf as safe and reliable as it used to be before the backlogs. As transactions are virtually guanteed to be included in the next block, it is nearly impossible for fraud to occur. 

# Design Goals

- Simple to use
- No server-side infrastructure
- No private keys used (stored or transmitted)
- Multiple fiat currencies supported

# TODO

- Retry API on failure
- Fall back to multiple APIs
- Calculate transaction fee
- History of transactions
- Generate recieve addresses for user