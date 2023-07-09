'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.css";
const intialData = {
  "data":[
    {
      "ask":1921.7,
      "bid":1921.62,
      "symbol":"XAUUSD"
    },
    {
      "ask":22.896,
      "bid":22.892,
      "symbol":"XAGUSD"
    }
  ],
  "dataOmrGm":[
    {
      "ask":16.475,
      "bid":16.475,
      "symbol":"XAUUSD",
    },
    {
      "ask":0.023,
      "bid":0.023,
      "symbol":"XAGUSD",
    }
  ],
  "dataOmrT":[
    {
      "ask":2783.582,
      "bid":2783.467,
      "symbol":"XAUUSD"
    },
    {
      "ask":297.648,
      "bid":297.596,
      "symbol":"XAGUSD"
    }
  ]
}

export default function Home() {
  const [data, setData] = React.useState(intialData)

  const fetchQuotas = async () => {
    try {
      const response = await axios.get('http://muscatbullionproject.grabyourservices.com:5000/api/prices');
      setData(response.data)
    } catch (e) {
      console.log('Error while fetching data. ' + e)
    }
  }
  
  const [intervalId, setIntervalId] = React.useState<NodeJS.Timer | undefined>();

  React.useEffect(() => {
    const fetchQuotasAndSetInterval = async () => {
      await fetchQuotas(); // Fetch quotas immediately on mount
      const id = setInterval(fetchQuotas, 1000); // Fetch quotas every 60 seconds and store the interval ID
      setIntervalId(id); // Set the interval ID in state
    };

    fetchQuotasAndSetInterval();

    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Clear the interval when the component unmounts
      }
    };
  }, []);

  return (
    <div className='' style={{ backgroundColor:'black',minHeight: '100vh' }}>
      <div className='main-card pt-4'>
        <div className="d-flex p-3 justify-content-center text-white " >
          <div className='main-title' >MUSCAT BULLION</div>
        </div>
        <div className='d-flex justify-content-center p-3'>
          <div className='col p-5 pb-0'>
            <div className='row d-flex flex-column'>
              <div className='col p-5  d-flex flex-column m-card'>
                <div className='d-flex justify-content-between card-mark '>
                  <div className='m-title'>LIVE PRICES (24 CARAT)</div>
                  <div className='m-hint'>BID</div>
                </div>
                <div className='d-flex mt-3 justify-content-between'>
                  <span>Gold Ounce($)</span> <span className='price'>${data.data[0].bid}</span>
                </div>
                <div className='d-flex mt-3 justify-content-between'>
                  <span>Silver Ounce($)</span> <span className='price'>${data.data[1].bid}</span>
                </div>
              </div>
              <div className='col p-5 mt-5  d-flex flex-column m-card'>
                <div className='card-mark'>
                  <div className='d-flex justify-content-between '>
                  <div className='m-title' >OMR PRICES LIVE (24 CARAT)</div>
                  <div className='m-hint'>BUY</div>
                  </div>
                </div>

                <div className='d-flex mt-3 justify-content-between'>
                  <span>Gold Per Gram</span> <span className='price'>{data.dataOmrGm[0].bid} OMR</span>
                </div>
                <div className='d-flex mt-3 justify-content-between'>
                  <span>Gold Ten Tola Bar</span> <span className='price'>{data.dataOmrT[0].bid} OMR</span>
                </div>
                <div className='d-flex mt-3 justify-content-between'>
                  <span>Silver Per Gram</span> <span className='price'>{data.dataOmrGm[1].bid} OMR</span>
                </div>
                <div className='d-flex mt-3 justify-content-between'>
                  <span>Silver Kilo Bar</span> <span className='price'>{data.dataOmrT[1].bid} OMR</span>
                </div>
              </div>
            </div>
          </div>
          <div className='col p-5 pb-0'>
            <div className='row d-flex flex-column'>
              <div className='col p-5  d-flex flex-column m-card' >
                <div className='d-flex justify-content-between card-mark'>
                  <div className='m-hint'>ASK</div> <div className='m-title' >أسعار حية (24 قيراط)</div>
                </div>
                <div className='d-flex mt-3 justify-content-between'>
                  <span className='price'>${data.data[0].ask}</span> <span>($) أوقية الذهب</span>
                </div>
                <div className='d-flex mt-3 justify-content-between'>
                  <span className='price'>${data.data[1].ask}</span> <span>($) أوقية الفضة</span>
                </div>
              </div>
              <div className='col p-5 mt-5  d-flex flex-column m-card'>
                <div className='d-flex justify-content-between card-mark'>
                  <div className='m-hint'>SELL</div> <div className='m-title' >أسعار ريال عماني مباشر (24 قيراط)</div>
                </div>
                <div className='d-flex mt-3 justify-content-between'>
                  <span className='price'>{data.dataOmrGm[0].ask} OMR</span> <span>الذهب لكل جرام</span>
                </div>
                <div className='d-flex mt-3 justify-content-between'>
                  <span className='price'>{data.dataOmrT[0].ask} OMR</span> <span>الذهب تين تولا بار</span>
                </div>
                <div className='d-flex mt-3 justify-content-between'>
                  <span className='price'>{data.dataOmrGm[1].ask} OMR</span> <span>أوقية الذهب</span>
                </div>
                <div className='d-flex mt-3 justify-content-between'>
                  <span className='price'>{data.dataOmrT[1].ask} OMR</span> <span>أوقية الفضة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
