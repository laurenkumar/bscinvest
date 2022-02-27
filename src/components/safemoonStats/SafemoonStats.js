import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import BigNumber from "bignumber.js";
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import "./SafemoonStats.css";
import Select from 'react-select';
import { useLocalStorage } from "../../helpers/useLocalStorage";

function SafemoonStats() {
  let count = 1;
  let count2 = 1;
  const [address, setAddress] = useLocalStorage("address", "");
  const [tokens, setTokens] = useLocalStorage("tokens", "[]");
  const [stats, setStats] = useState(null);
  const [firstBought, setFirstBought] = useState(null);
  const [firstPrice, setFirstPrice] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(null);
  const [topToken, setTopToken] = useState(null);
  const [tokenNews, setTokenNews] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [pancake, setPancakePrice] = useState("");

  const getNumber = function(num) {
    const units = ["M","B","T","Q"]
    const unit = Math.floor((num / 1.0e+1).toFixed(0).toString().length);
    const r = unit%3;
    const x =  Math.abs(Number(num))/Number('1.0e+'+(unit-r)).toFixed(2);

    return x.toFixed(2) + units[Math.floor(unit / 3) - 2];
  }

  function insertDecimal(num, decimal) {
    return getNumber(num / (10**decimal));
  }

  const kFormatter = function(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
  }

  function LinearProgressWithLabel(props) {
    return (
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
      </Box>
    );
  }

  LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
  };

  const monthsDiff = function(endDate) {
    const monthDifference =  moment(new Date(endDate)).diff(new Date(), 'months', true);

    return Math.abs(Math.round(parseFloat(monthDifference)));
  }

  const getSupplyDone = () => {
    const percent = stats?.market_data?.circulating_supply * 100 / stats?.market_data?.total_supply;
    return Math.round(parseFloat(percent));
  }

  const getOpenPercent = () => {
    const percent = 100 - (stats?.developer_data?.closed_issues * 100 / stats?.developer_data?.total_issues);

    return Math.round(parseFloat(percent));
  }

  const handleChange = async (e) => {
    setSelectedToken(e);

    axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=` + e.value + `&address=` + address + `&startblock=0&endblock=999999999&sort=asc&apikey=DG87ABXXWMX1NV9BDFXJFUXVK34J9DRQJP`)
        .then(res => {
          setFirstBought(moment.unix(res.data.result[0].timeStamp).format("MMM Do YY"))
          setOriginalPrice(insertDecimal(res.data.result[0].value, res.data.result[0].tokenDecimal));
          axios.get(`https://api.coingecko.com/api/v3/coins/` + e.label.toLowerCase() + `/history?date=` + moment.unix(res.data.result[0].timeStamp).format("DD-MM-YYYY"))
            .then(res2 => {
              const quantityBought = res.data.result[0].value / 10**res.data.result[0].tokenDecimal;
              setFirstPrice(res2.data.market_data.current_price.usd * quantityBought);
          })
            .catch(err => {
              setFirstPrice();
          });
    });

    axios.get(`https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/` + e.value)
      .then(res => {
        setStats(res.data);
    })
      .catch(err => {
        setStats();
    });

    axios.get(`https://api.pancakeswap.info/api/v2/tokens/` + e.value).then(res=>{
      const pancakePrice = parseFloat(res.data.data.price);
      setPancakePrice(pancakePrice);
    }).catch(err => console.log(err));

    axios
      .get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
      )
      .then(res => {
        setTopToken(res.data);
      })
      .catch(error => console.log(error));

    const apiKey = "3663a9f5329764cf1780627b1a669d96";

    const redditApi = `https://gnews.io/api/v4/search?q=` + e.label + `&max=3&token=${apiKey}`;
    await axios.get(redditApi).then(res => {
        setTokenNews(res.data);
    })
    .catch(error => console.log(error));
  }

  return (
    <>
      <section>
        <div> 
          <span className="card-pin"></span>
          <div>
            <h2 className="coin-text select-token">
              See the Stats of
              <Select
                value={selectedToken}
                defaultValue={selectedToken}
                onChange={(setSelectedToken) => handleChange(setSelectedToken)}
                options={tokens}
                placeholder=". . ."
                className="token-select"
              />
            </h2>
            {stats ?
            <div>
              <div className="your-stats-container">
                <p>You bought {originalPrice} of this token on {firstBought} {firstPrice ? "for " + firstPrice?.toFixed(2) + "$" : ""}</p>
              </div>
              {stats?.public_notice ?
              <div className="public-notice" dangerouslySetInnerHTML={{ __html: stats?.public_notice }} />
              : null
              }
              <div>
                <div className="flex">
                  <div className="bold crypto-price">${stats?.market_data?.current_price?.usd}</div> 
                  <div className={Math.sign(stats?.market_data?.price_change_percentage_24h) === -1 ? 'red' : 'green'}>
                      <span>{stats?.market_data?.price_change_percentage_24h}%</span>
                  </div>
                </div>
              </div> 
              <div className="flex justify-content-between">
                <div>
                  <span className="small-title">Market Cap
                  </span> 
                  <div className="center">{stats?.market_data?.market_cap?.usd > 999999 ? getNumber(stats?.market_data?.market_cap?.usd) : stats?.market_data?.market_cap?.usd}
                  </div>
                </div> 
                <div>
                  <span className="small-title">Circulating Supply
                  </span> 
                  <div className="center">
                    <span>{stats?.market_data?.circulating_supply > 999999 ? getNumber(stats?.market_data?.circulating_supply) : stats?.market_data?.circulating_supply}</span> 
                  </div>
                </div> 
                <div>
                  <span className="small-title">Total Supply</span> 
                  <div className="center">{getNumber(stats?.market_data?.total_supply)}</div>
                </div>
              </div>  
              <div> 
                <div className="crypto-bar">
                  <LinearProgressWithLabel value={getSupplyDone()} />
                </div> 
                <span className="crypto-caption">{getSupplyDone()}% of total supply ({getNumber(stats?.market_data?.total_supply)})
                </span> 
              </div>
              <div className="flex pancake">
                  <span className="bold">PancakeSwap (v2) Price
                  </span> 
                  <div className="bold">${parseFloat(pancake).toFixed(9).replace(/\.?0+$/,"")}
                  </div>
              </div>
              <div>
                <table>
                  <caption><h3>Market Data</h3></caption>
                  <tbody>
                    <tr>
                      <th scope="row">Market Cap Rank</th> 
                      <td>
                        <div>#{stats?.market_data?.market_cap_rank}</div>
                      </td>
                    </tr> 
                    <tr>
                      <th scope="row">CoinGecko Rank</th> 
                      <td>
                        <div>#{stats?.coingecko_rank}</div>
                      </td>
                    </tr> 
                    <tr>
                      <th scope="row">CoinGecko Overall Score</th> 
                      <td>
                        <div>{Math.round(parseFloat(stats?.coingecko_score))}%</div>
                      </td>
                    </tr> 
                    <tr>
                      <th scope="row">CoinGecko Liquidity Score</th> 
                      <td>
                          <div>{Math.round(parseFloat(stats?.liquidity_score))}%</div>
                      </td>
                    </tr> 
                    <tr>
                      <th scope="row">All Time High</th> 
                      <td>
                        <div>${stats?.market_data?.ath?.usd}</div> 
                        <div className="crypto-caption">{monthsDiff(stats?.market_data?.ath_date?.usd)} months ago</div>
                      </td>
                    </tr> 
                    <tr>
                      <th scope="row">All Time Low</th> 
                      <td>
                        <div>${stats?.market_data?.atl?.usd.toFixed(8).replace(/\.?0+$/,"")}</div> 
                        <div className="crypto-caption">{monthsDiff(stats?.market_data?.atl_date?.usd)} months ago</div>
                      </td>
                    </tr>
                  </tbody>
                </table> 
                 
                <table>
                  <caption><h3>Community Data</h3></caption>
                  <tbody>
                    <tr>
                      <th scope="row">CoinGecko Community Score</th> 
                      <td>
                        <div>{stats?.community_score}%</div>
                      </td>
                    </tr> 
                    <tr>
                      <th scope="row">Reddit Subscribers</th> 
                      <td>
                        <div>{kFormatter(stats?.community_data?.reddit_subscribers)}</div>
                      </td>
                    </tr> 
                    <tr>
                      <th scope="row">Twitter Followers</th> 
                      <td>
                        <div>{stats?.community_data?.twitter_followers > 999999 ? getNumber(stats?.community_data?.twitter_followers) : stats?.community_data?.twitter_followers}</div>  
                      </td>
                    </tr>
                  </tbody>
                </table> 
                 
                <table>
                  <caption><h3>Developer Data</h3></caption>
                  <tbody>
                    <tr>
                      <th scope="row">CoinGecko Developer Score</th> 
                      <td>
                        <div>{stats?.developer_score}%</div>
                      </td>
                    </tr> 
                    <tr>
                      <th scope="row">Number of Stars</th> 
                      <td>
                        <div>{stats?.developer_data?.stars}</div>
                      </td>
                    </tr> 
                    <tr>
                      <th scope="row">Contributors</th> 
                      <td>
                        <div>{stats?.developer_data?.pull_request_contributors}</div>
                      </td>
                    </tr> 
                    <tr>
                      <th scope="row">Forks</th> 
                      <td>
                        <div>{stats?.developer_data?.forks}</div>
                      </td>
                    </tr> 
                    <tr>
                      <th scope="row">Issues</th> 
                      <td>
                        <div>{stats?.developer_data?.total_issues}</div> 
                        <div className="crypto-caption">{stats?.developer_data?.total_issues > 0 ? getOpenPercent() : stats?.developer_data?.total_issues}% open</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            : stats === undefined ?
            <div>
              <b>This token is not present on <a href="https://www.coingecko.com/">Coingecko</a></b>
              <p><b>Be careful, it can mean a few things:</b></p>
              <ul>
                <li>The team behind the token didn't apply yet to get listed on Coingecko</li>
                <li>The token is dead and you are left with a bag</li>
                <li>This is a <a href="https://academy.binance.com/en/articles/what-is-a-dusting-attack"><b>dust token</b></a>, in which case you shouldn't interact with it</li>
              </ul>
            </div>
            :
            <div>
              <b>Choose a token</b>
            </div>
            }
          </div>
          <span className="card-pin second-pin"></span>
        </div>

      </section>

      {stats && stats?.market_data?.circulating_supply > 0 ?
      <div className="compare-dashboard">
        <section>
          <h2 className="coin-text">What if {selectedToken.label} reached the market cap of...</h2>
          <div className="caption-container"><span className="crypto-caption">(With a circulating supply halved)</span></div>
            {topToken?.map((coin) => (
            <div key={coin.name} className="coin-container">
              <span className="card-pin"></span>
              <div className="coin-compare-init coin-infos">
                <div className="coin-count">{count++}</div>
                <div className="coin-infos first-coin">
                  <div className="coin-img">
                    <img src={coin.image} alt={"icon of " + coin.name} />
                  </div>
                  <div className="coin-name">
                    <div><span>{coin.symbol}</span></div>
                    <div><span>{coin.name}</span></div>
                  </div>
                </div>
                <div className="coin-market-cap">${getNumber(coin.market_cap)}</div>
              </div>

              <div className="coin-compare-safe coin-infos">
                <div className="coin-img">
                  <img src={stats?.image.thumb} alt={"icon of " + stats?.name} />
                </div>
                <div className="coin-name">
                  <span>{stats?.name}</span>
                </div>
                <div className="coin-potential">
                  <div>
                    <span>Current Price</span>
                    <div><span>${stats?.market_data?.current_price?.usd}</span></div>
                  </div>
                  <div>
                    <span>Potential Price</span>
                    <div><span className="up-text">${(coin.market_cap / (stats?.market_data?.circulating_supply / 2)).toFixed(5)}</span></div>
                  </div>
                  <div>
                    <span>Potential Upside</span>
                    <div><span className="upside">{((coin.market_cap / (stats?.market_data?.circulating_supply / 2)) / stats?.market_data?.current_price?.usd).toFixed()}x</span></div>
                  </div>
                </div>
              </div>
              <span className="card-pin second-pin"></span>
            </div>
            ))}
        </section>
      </div>
      : null
      }
      {stats ?
        <div className="token-news">
          <section>
            <h2 className="coin-text">Last news of {selectedToken.label}</h2>
            {tokenNews?.articles.length > 0 ?
              <div className="news-container">
                {tokenNews?.articles.map((article) => (
                    <article key={article.title} className="card">
                      <div className="card-inner">
                        <span className="card-pin"></span>
                        <div className="card-image">
                          <img src={article.image} alt={"News about " + selectedToken.label} />
                        </div>
                        <div className="card-content">
                          <div className="card-meta">
                            <span className="card-meta-number"><a href={article.url} target="_blank">Read the article</a></span>
                          </div>
                          <h3 className="card-title article-title">{article.title}</h3>
                        </div>
                      </div>
                    </article>
                ))}
              </div>
            : <div><p>No news</p></div>
            }
          </section>
        </div>
      : null
      }
    </>
  );
}

export default SafemoonStats;