# Auction

## The main characters:
- Escrow
- Seller
- Buyer

## Working principle:

Seller creates an article (approving to spend for that procedure 10 MEIs) in which he gives the full description of the product he wants to sell, set the minimum price, the BuyItNow price and the time of the auction.

Each and every buyer is able to set a new bet, which should be bigger than:

- minimal price at the very beginning 
- previous bet

In both cases the bet increases and tokens are being transferred to escrow`s account. If that wasn’t the first bet, previous tokens would be returned to their owner.

Main escrows role to be in the very middle of all those events and to coordinate relations between buyer and seller. He keeps their addresses, the size of the bet, the BuyItNow value, money from buyers account, etc. He is able of transferring tokens from one accoount to another one.

Auction ends in three cases:

- seller canceled the article (if there were any bets, all tokens returns to their owner)
- somebody has chosen the option of the immediate buying (if there were any bets, all tokens returns to their owner) and the buyer pays the full price (10% tax will be taken to escrows account)
- time of the auction ended, so that money transfers from the escrow’s account to buyer’s one, or if there wasn’t any bets the article simply disappears

_You need to have metamask installed before you enter the_
[site](https://serhiypro.github.io/Auction-project/)  
