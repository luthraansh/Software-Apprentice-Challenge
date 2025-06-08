import './Card.css';


function Card(props) {
  return (
    <>
      {props.cards ? (
        <table>
          <thead>
            <tr>
              <th>Seq.</th>
              <th>Campaign</th>
              <th>Adset</th>
              <th>Creative</th>
              <th>Spend</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>Results</th>
            </tr>
          </thead>
          <tbody>
            {props.cards.map((card, index) => (
              <tr key={"card-"+index}>
                <td>{index+1}</td>
                <td>{card.campaign}</td>
                <td>{card.adset}</td>
                <td>{card.creative}</td>
                <td>{card.spend}</td>
                <td>{card.impressions}</td>
                <td>{card.clicks}</td>
                <td>{card.results}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading data...</p>
      )}
    </>
  )
}

export default Card