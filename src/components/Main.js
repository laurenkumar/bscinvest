import React, {useState} from "react";
import {Link} from "react-router-dom";
import "./Main.css";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddressAndTokens from "./addressAndTokens/AddressAndTokens";
import Blog from "./blog/Blog";
import Svg from "./svg/Svg";
import Modal from "./Modal/Modal";
import {useStateValue} from "../StateProvider";
import MediaQuery from 'react-responsive';
import { useLocalStorage } from "../helpers/useLocalStorage";

const useStyles = makeStyles({
  root: {
    border: 'none',
    boxShadow: 'none',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    overflowX: 'scroll',
  },
  link: {
    textDecoration: 'none',
    textDecoration: 'none',
    background: '#fff',
    margin: '1rem',
    marginBottom: '1.5rem',
    borderRadius: '.5rem',
    padding: '1rem 2rem',
    boxShadow: '0 6px 10px 0 rgb(31 38 135 / 37%)',
    transition: 'transform .2s,box-shadow .2s',
  },
});

const iconStyle = (fontsize) => {
  return {
    fill: "transparent",
    stroke: "#1a1a2c",
    strokeWidth: 0.25,
    fontSize: fontsize,
  };
};

function Main() {
  const [address, setAddress] = useLocalStorage("address", "");
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();

  function handleChange(address) {
    setAddress(address);
  }

  return (
    <>
      <svg className="svg-title" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500">
            <defs>
              <path d="M50,250c0-110.5,89.5-200,200-200s200,89.5,200,200s-89.5,200-200,200S50,360.5,50,250" id="textcircle">
                <animateTransform
                        attributeName="transform"
                        begin="0s"
                        dur="30s"
                        type="rotate"
                        from="0 250 250"
                        to="360 250 250"
                        repeatCount="indefinite" 
                />
              </path>
            </defs>
            <text dy="70" textLength="1220">
              <textPath xlinkHref="#textcircle">Your Crypto Corner *</textPath>
            </text>
      </svg>
      <button className="network modalButton" onClick={() => setIsOpen(true)}>
        Buy Crypto
      </button>
      {isOpen && <Modal setIsOpen={setIsOpen} />}
      <MediaQuery minWidth={1400}>
        <main className="main">
          <div className='coin-app header-container'>
            <AddressAndTokens address={address} onChange={handleChange}/>
          </div>
          <Blog />
        </main>
      </MediaQuery>
      <MediaQuery maxWidth={1399}>
        <main className="main-mobile">
          <AddressAndTokens address={address} onChange={handleChange}/>
        </main>
      </MediaQuery>
      <Svg />
    </>
  );
}
export default Main;
