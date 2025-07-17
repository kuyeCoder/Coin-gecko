import { useEffect, useState } from "react";
import Chart from "react-google-charts";

// currency : 
const AreaChart = ({historicalData, currencySymbol}) => {
  // Initializes chart data with just header row
  // Chart expects 2 columns: Date and Price.
  const [data, setData] = useState([["Date", "Prices"]]);

  /**
   * Runs when historical data changes
   * Convert timestamps to JS Date objects and creates chart-friendly data format.
   * 
  //  * Add headers to the top of the array
   * 
   */

  useEffect(() => {
    if(historicalData?.prices){
      /*
      It iterates over each item in the historicalData.prices array. Each item is expected to be an array, where item[0] is a timestamp and item[1] is the price.


      new Date (item[0]) converts the timestamp (which is likely in milliseconds) into Javascript Date object, which Google Charts needs for its date axis.
      */

      const formattedData = historicalData.prices.map(item => [ 
        new Date (item[0]), // date
        item[1] // prices
      ]);
      // spreading so that it dosent lose data
      setData([['Date', 'Price'], ...formattedData])

    }
  }, [historicalData]);
  console.log(currencySymbol);
  const options = {
    backgroundColor: 'transparent',
    legend: 'none',
    curveType: 'function', // Makes the line smoothed
    hAxis: { // Horizontal axis (Date axis)
      textStyle: { color: '#FFFFFF' }, // White text for dates
      gridlines: { color: '#444444' }, // Gray grid lines
      format: 'MMM dd', // Date format (e.g., "Jul 10")
    },
    vAxis: { // Vertical axis (Price axis)
      textStyle: { color: '#FFFFFF' }, // White text for prices
      gridlines: { color: '#444444' }, // Gray grid lines
      format: `${currencySymbol}#,##0.00` // Dynamic currency formatting (e.g., "$1,234.56")
    },
    chartArea: { // Styling for the actual chart drawing area
      backgroundColor: {
        fill: 'transparent',
        opacity: 0
      },
      width: '90%',
      height: '80%'
    },
    colors: ['#10B981'], // Color of the area chart line (a shade of green)
    lineWidth: 3, // Thickness of the chart line
    trendlines: { // Configuration for a trendline (a linear regression line)
      0: { // Applies to the first (and only) series
        type: 'linear',
        color: '#00FFFF', // Cyan color for the trendline
        lineWidth: 1,
        opacity: 0.4,
        showR2: false // Don't show the R-squared value
      }
    },
    crosshair: { // Configuration for the crosshair that appears on hover
      trigger: 'both', // Triggers on both mouseover and focus
      orientation: 'vertical',
      color: '#00FFFF', // Cyan color for the crosshair
      opacity: 0.2
    },
    tooltip: { // Styling for the tooltip that appears on hover
      textStyle: { color: '#000000' }, // Black text for the tooltip
      showColorCode: true,
      isHtml: true // Allows HTML content in tooltips (though not used here directly)
    }
  };
  return (
    <div className="w-full bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/20">
      <Chart chartType="AreaChart" data={data} options={options} loader={<div className="text-emerald-400">Loading Market Data...</div>}
      rootProps={{'data-testid': '1'}} />

    </div>
  )
}

export default AreaChart