import './Info.css'
import React, { useState, useEffect } from 'react';
import Card from './Card.js'

function Info() {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const platforms = [
    { id: 'facebook_ads', campaign: 'campaign_name', adset: 'media_buy_name', creative: 'ad_name', spend: 'spend', impressions: 'impressions', clicks: 'clicks'},
    { id: 'twitter_ads', campaign: 'campaign', adset: 'ad_group', creative: 'image_name', spend: 'spend', impressions: 'impressions', clicks: 'post_clicks'},
    { id: 'snapchat_ads', campaign: 'campaign_name', adset: 'ad_squad_name', creative: 'creative_name', spend: 'cost', impressions: 'impressions', clicks: 'post_clicks'}
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/fakeDataSet');
        const result = await response.json();
        setJsonData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means the effect runs only once after initial render

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const stdCards = [];
  const addStdCard = (campaign, adset, creative, spend, impressions, clicks) => {
    const matchingCard = stdCards.find(stdCard => stdCard.campaign === campaign && stdCard.adset === adset && stdCard.creative === creative);
    if (!matchingCard) {
      const newStdCard = {
          campaign,
          adset,
          creative,
          spend,
          impressions,
          clicks,
          results: 0
      };
      stdCards.push(newStdCard);
    }
  };

  // converting json data to standardized data
  platforms.map((platform, i) => (
    jsonData[platform.id].map((jsonCard, j) => (
      addStdCard(jsonCard[platform.campaign], jsonCard[platform.adset], jsonCard[platform.creative], jsonCard[platform.spend], jsonCard[platform.impressions], jsonCard[platform.clicks])
    ))
  ))

  // add up results from google analytics and update standard card
  jsonData['google_analytics'].map((card, i) => {
    let matchingCard = stdCards.find(stdCard => stdCard.campaign === card['utm_campaign'] && stdCard.adset === card['utm_medium'] && stdCard.creative === card['utm_content'])
    if (matchingCard) {
      matchingCard.results += card.results
    }
  })

  const filteredCards = stdCards.filter(stdCard => 
      stdCard.campaign.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event) => {
      setSearchTerm(event.target.value);
  };

  const handleSort = (event) => {
      setSortOrder(event.target.value);
  };

  const sortedCards = filteredCards.toSorted((a, b) => {
    if (sortOrder === 'spend-asc') return (a.spend - b.spend); // Ascending
    else if (sortOrder === 'spend-desc') return (b.spend - a.spend); // Descending
    else return true; // do not sort
  });

  return (
    <>
      <div className="filters">
        Search by Campaign:{' '}
        <input type="text" placeholder="Type here" value={searchTerm} onChange={handleSearch} />
        {'   '}Sort By:{' '}
        <select value={sortOrder} onChange={handleSort}>
          <option value="">None</option>
          <option value="spend-asc">Spend: Ascending</option>
          <option value="spend-desc">Spend: Descending</option>
        </select>
        Count:{' '}{sortedCards.length}
        <Card cards={sortedCards} ></Card>
      </div>
    </>
  );
}

export default Info;