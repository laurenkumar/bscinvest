import React, { useState, useEffect } from "react";
import { useLocalStorage } from "../../helpers/useLocalStorage";
import {Link} from "react-router-dom";
import "./AddressAndTokens.css";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { ActionMeta, OnChangeValue } from 'react-select';
import axios from 'axios';
import Network from '../network/Network';

function AddressAndTokens(address) {

  const handleChange = async (e) => {
    await address.onChange(e);
  };

  return (
    <>
      <section className="userWallet">
        <div className='coin-app'>
          <TextField id="walletAddress" label="What is your wallet address ?" variant="outlined" onChange={(e) => handleChange(e.target.value)} value={address.address} />
        </div>
      </section>
      {address.address ?
        <Network address={address} />
      : null
      }
    </>
  );
}
export default AddressAndTokens;
