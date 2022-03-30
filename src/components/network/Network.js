import React, { useState, useEffect } from "react";
import { useLocalStorage } from "../../helpers/useLocalStorage";
import {Link} from "react-router-dom";
import "./Network.css";
import axios from 'axios';
import TokenStats from '../tokenStats/TokenStats';

function Network(address) {
  const [tokens, setTokens] = useLocalStorage("tokens", "");
  const [networks, setNetworks] = useState(null);
  const [networkSelected, setNetworkSelected] = useState(null);

  useEffect(()=> {
     axios.get(`https://api.covalenthq.com/v1/chains/?quote-currency=USD&format=JSON&key=ckey_6864852606fc492daa155c47e87`)
        .then(res => {
          const mainNetworks = res.data.data.items.filter(x => x.is_testnet === false);
          setNetworks(mainNetworks);
     });
  },[]);

  function showTokens(name, chainId) {
    getToken(chainId);

    switch (name) {
      case 'bsc-mainnet':
        setNetworkSelected("binance-smart-chain");
        break;
      case 'eth-mainnet':
        setNetworkSelected("ethereum");
        break;
      case 'matic-mainnet':
        setNetworkSelected("polygon-pos");
        break;
      case 'avalanche-mainnet':
        setNetworkSelected("avalanche");
        break;
      case 'moonbeam-mainnet':
        setNetworkSelected("moonbeam");
        break;
      case 'moonbeam-moonriver':
        setNetworkSelected("moonbeam");
        break;
      case 'rsk-mainnet':
        setNetworkSelected("rootstock");
        break;
      case 'arbitrum-mainnet':
        setNetworkSelected("arbitrum-one");
        break;
      case 'fantom-mainnet':
        setNetworkSelected("fantom");
        break;
      case 'palm-mainnet':
        console.log("Sorry this network is not available on coingecko");
        break;
      case 'klaytn-mainnet':
        setNetworkSelected("klay-token");
        break;
      case 'heco-mainnet':
        setNetworkSelected("huobi-token");
        break;
      case 'axie-mainnet':
        console.log("Sorry this network is not available on coingecko");
        break;
      case 'astar-shiden':
        console.log("Sorry this network is not available on coingecko");
        break;
      case 'iotex-mainnet':
        setNetworkSelected("iotex");
        break;
      case 'harmony-mainnet':
        setNetworkSelected("harmony-shard-0");
        break;
      case 'harmony-testnet':
        console.log("Sorry this network is not available on coingecko");
        break;
      case 'covalent-internal-network-v1':
        console.log("Sorry this network is not available on coingecko");
        break;
      default:
        console.log(`Sorry, this network is not available.`);
    }
  }

  function getToken(chainId) {
    if (address.address) {
      axios.get(`https://api.covalenthq.com/v1/` + chainId + `/address/` + address.address.address + `/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_6864852606fc492daa155c47e87`)
      .then(res => {
        const listTokens = [];
        res.data.data.items.map(token => {
          if (token.contract_name != null)
            listTokens.push({"label": token.contract_name, "value": token.contract_address, "balance": token.balance, "quote": token.quote, "decimals": token.contract_decimals});
        });
        setTokens(listTokens);
      });

    } else {
      console.log("wrong format")
    }
  }

  return (
    <>
      <section className="network-container">
        <h2 className="coin-text">Chosse a network</h2>
        <div className="networks-container">
        {networks?.map((network) => (
          <button id={network.name} key={network.name} className="network" onClick={() => showTokens(network.name, network.chain_id)}>
            <img src={network.logo_url} width="30px"/>
            <span>{network.label}</span>
          </button>
        ))}
        </div>
      </section>
      <div className="safemoon-dashboard">
        <TokenStats address={address} tokens={tokens} network={networkSelected} />
      </div>
    </>
  );
}
export default Network;
