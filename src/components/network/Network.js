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
          console.log(res);
          const mainNetworks = res.data.data.items.filter(x => x.is_testnet === false);
          setNetworks(mainNetworks);
      });
  },[]);

  function showTokens(name, chainId) {
    getToken(chainId);
    setNetworkSelected(name);
  }

  function getToken(chainId) {
    if (address.address) {
      axios.get(`https://api.covalenthq.com/v1/` + chainId + `/address/` + address.address.address + `/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_6864852606fc492daa155c47e87`)
      .then(res => {
        const listTokens = [];
        res.data.data.items.map(token => {
          if (token.contract_name != null)
            listTokens.push({"label": token.contract_name, "value": token.contract_address, "balance": token.balance, "quote": token.quote});
        });
        setTokens(listTokens);
      });

    } else {
      console.log("wrong format")
    }
  }

  return (
    <>
      <section>
        <h2>Chosse a network</h2>
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
