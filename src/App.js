import React, { useState, useEffect } from "react";
import "./App.css";
import SideDrawer from "./components/SideDrawer";
import InfoBoxes from './components/InfoBoxes';
import Table from './components/Table';
import LineGraph from './components/LineGraph';
import Map from './components/Map';

import { sortData } from './utils';
import { FormControl, Select, MenuItem, Card, CardContent } from "@material-ui/core";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
            flag: country.countryInfo.flag,
          }));

          const Data = sortData(data);
          setTableData(Data);
          setCountries(countries);
        });
    };

    getCountries();
  }, []);

  //Selecting country from the dropdown
  const onSelectCountry = async (e) => {
    const countryCode = e.target.value;

    const url = countryCode === 'worldwide' ? 
    "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then((response) => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data)
    })
  };

  return (
    <div className="App">
      <div className="app_left">
        <div className="app_header">
          <SideDrawer />
          <h1> Covid-19</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onSelectCountry}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Info Boxes */}

        <div className="app_stats">
          <InfoBoxes
            title="CoronaVirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />

          <InfoBoxes
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />

          <InfoBoxes
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>

        <Map/>

      </div>
      <div className="app_right">
        <Card>
          <CardContent>
            <h3>Live Cases by Country</h3>
                <Table data={tableData}/>
            <h3>Worldwide New Cases</h3>
            <LineGraph casesType="cases"/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
