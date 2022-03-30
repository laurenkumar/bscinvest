import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import "./Blog.css";

function Blog() {
  let count = 1;
  const [tokenLargeNews, setTokenLargeNews] = useState(null);

  useEffect(()=> {
    const apiKey = "3663a9f5329764cf1780627b1a669d96";

    const redditApi = `https://gnews.io/api/v4/search?q=crypto&max=5&token=${apiKey}`;
    axios.get(redditApi).then(res => {
        setTokenLargeNews(res.data)
    });

  },[]);

  return (
    <div className="blog-part right-blog">
      <marquee width="100%" direction="left">
          <a href="https://cryptonews.com/" target="_blank"><span>Crypto News</span></a>
          <a href="https://cryptonews.com/" target="_blank"><span>Crypto News</span></a>
          <a href="https://cryptonews.com/" target="_blank"><span>Crypto News</span></a>
          <a href="https://cryptonews.com/" target="_blank"><span>Crypto News</span></a>
          <a href="https://cryptonews.com/" target="_blank"><span>Crypto News</span></a>
          <a href="https://cryptonews.com/" target="_blank"><span>Crypto News</span></a>
      </marquee>
      <div className="blog-right-title-container">
        <div className="blog-right-title">
          Last Crypto News
        </div>
      </div>
      <div className="blog-right">
        {tokenLargeNews?.articles.map((article) => (
        <div key={count} className="blog-right-container">
          <a href={article.url} target="_blank">
              <div className="blog-title-date">
                <div className="blog-right-page">{count++}</div>
                <div className="date">{moment(article.publishedAt).format("MMM Do YY")}</div>
              </div>
              <div className="blog-right-page-title">{article.title}</div>
              <div className="blog-right-page-subtitle">{article.description}</div>
          </a>
        </div>
        ))}
      </div>
    </div>
    );
  }

  export default Blog;