import React, { useState, useEffect } from "react";
import { useLocalStorage } from "../../helpers/useLocalStorage";
import {Link} from "react-router-dom";
import "./AddressAndTokens.css";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { ActionMeta, OnChangeValue } from 'react-select';
import axios from 'axios';

function AddressAndTokens() {
  const [address, setAddress] = useLocalStorage("address", "");
  const [tokens, setTokens] = useLocalStorage("tokens", "[]");

  const handleSubmit = async (e) => {
    await setAddress(e.target.value);
  };

  function getToken() {
    if (address) {
      axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&address=` + address + `&sort=asc&apikey=DG87ABXXWMX1NV9BDFXJFUXVK34J9DRQJP`)
        .then(res => {
          const uniqueTokens = [];
          res.data.result.map(token => {
              let findItem = uniqueTokens.find((x) => x.tokenSymbol === token.tokenSymbol);
              if (!findItem) {
                uniqueTokens.push({"label": token.tokenSymbol, "value": token.contractAddress});
              }
          });
          const filteredTokens = Object.values(uniqueTokens.reduce((acc,cur)=>Object.assign(acc,{[cur.label]:cur}),{}));
          setTokens(filteredTokens);
      });
    } else {
      console.log("wrong format")
    }
  }

  useEffect(()=> {
    getToken();
  },[]);

  return (
    <section className="userWallet">
      <div className='coin-app'>
        <TextField id="walletAddress" label="What is your wallet address ?" variant="outlined" onChange={(e) => handleSubmit(e)} value={address} />
      </div>
    </section>
  );
}
export default AddressAndTokens;
