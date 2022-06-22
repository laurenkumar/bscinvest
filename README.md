## Your Crypto Corner

A simple webpage where the user just have to paste its wallet adress to see a list of all the tokens he have and upon selection see the stats of each of them, their last news and their possible price if they reached the market cap of the top 10 cryptos.
All network present on the Covalent API have been added.
No data is stored on any database, the only storage used is LocalStorage so that the user does not have to retype its wallet address.
No button to connect the user wallet will be added as I feel it would not be a good move UX wise.
You can now buy crypto via Transak.

BZZ link: https://bah5acgza2i2uimzoc246um67bu4xujyr3e7kav6r3rtax5od67fu4rojv3eq.bzz.link/
Also available at: https://bscinvest.vercel.app

## Transak Integration, buy your crypto

## Covalent API Endpoints used
- /v1/chains/ Returns a list of all chains.
- /v1/chain_id/address/address/balances_v2/ Get token balances for address

## Video demo:
https://vimeo.com/723092237

## How to run:
Install the dependencies
- npm i

Run the project
- npm start
