import logo from './logo.svg';
import './App.css';
import axios from 'axios';

import { useEffect, useState } from 'react';

export const Quota = ({ quota: { symbol, bid, ask, spread } }) => {
  return (
    <div className='quota'>
      <h1 style={{marginTop: '5px'}}>{symbol}</h1>
      <h4 style={{marginTop: '5px'}}>{bid}</h4>
      <h4 style={{marginTop: '5px'}}>{ask}</h4>
      <h4 style={{marginTop: '5px'}}>{spread}</h4>
    </div>
  );
};

export const Quotas = ({ quotas }) => {
  if (!quotas) {
    return <div>Fetching data...</div>; // Display a loading message when quotas is undefined
  }

  const quotaList = quotas.map((quota) => <Quota key={quota.symbol} quota={quota} />);
  return <div style={{display:'flex', flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#000', height: '100vh', justifyContent: 'center', alignItems: 'center'}}>{quotaList}</div>;
};

function App() {
  const [quotas, setQuotas] = useState([]);
  const [quotasOne, setQuotasOne] = useState([]);
  const [quotasTwo, setQuotasTwo] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track the loading state

  const fetchQuotas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/prices');
      setQuotas(response.data.data);
      setQuotasOne(response.data.dataOmrGm);
      setQuotasTwo(response.data.dataOmrT);
      if (response.data.data.length === 0) {
        setIsLoading(true);
      } else {
        setIsLoading(false); // Data fetched, set loading state to false
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  // ...
const [intervalId, setIntervalId] = useState(null);

useEffect(() => {
  const fetchQuotasAndSetInterval = async () => {
    await fetchQuotas(); // Fetch quotas immediately on mount
    const id = setInterval(fetchQuotas, 100); // Fetch quotas every 60 seconds and store the interval ID
    setIntervalId(id); // Set the interval ID in state
  };

  fetchQuotasAndSetInterval();

  return () => {
    clearInterval(intervalId); // Clear the interval when the component unmounts
  };
}, []); // Empty dependency array to run only once on mount
// ...

  return (
    <div style={{backgroundColor: '#fff', height: '100vh'}}>
      {isLoading ? <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#000', height: '100vh', justifyContent: 'center', alignItems: 'center', color: 'white'}}><h1>Fetching Data...</h1></div> : <><Quotas quotas={quotas} /><Quotas quotas={quotasOne} /><Quotas quotas={quotasTwo} /></>}
    </div>
  );
}

export default App;
