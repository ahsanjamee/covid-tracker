import React, { useState, useEffect } from 'react';
import './App.css';
import SideDrawer from './components/SideDrawer/SideDrawer';
import { FormControl, Select, MenuItem } from '@material-ui/core';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

  useEffect( () => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2,
            flag: country.countryInfo.flag
          }
        ))

        setCountries(countries);
      })
    }

    getCountries();
  }, [])

  //Selecting country from the dropdown
  const onSelectCountry = (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);
  }

  return (
    <div className="App">
      {console.log({countries})}
      <div className="app_header">
        <SideDrawer/>
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
    </div>
  );
}

export default App;
