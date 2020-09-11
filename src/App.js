import React, { useState, useEffect } from "react";
import SideDrawer from "./components/SideDrawer";
import InfoBoxes from "./components/InfoBoxes";
import Table from "./components/Table";
import LineGraph from "./components/LineGraph";
import Map from "./components/Map";

import { sortData, prettyFormat } from "./utils";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import Loader from "react-loader-spinner";
import PublicIcon from '@material-ui/icons/Public';

import "./styles/App.css";
import "./styles/Map.css";
import "./styles/Table.css";
import "leaflet/dist/leaflet.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [loader, setLoader] = useState(true);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 2500);
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

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
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountries();
  }, []);

  //Selecting country from the dropdown
  const onSelectCountry = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        console.log({ data });
        if (countryCode === "worldwide") {
          setMapCenter({ lat: 34.80746, lng: -40.4796 });
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        }

        setMapZoom(4);
      });
  };

  return (
    <>
      {loader ? (
        <div className="loader">
          <Loader
            type="Rings"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={2500} //2.5 secs
          />
        </div>
      ) : (
        <div className="App">
          <div className="app_left">
            <div className="app_header">
              <SideDrawer />
              <h1 className="app_header_title"> <PublicIcon className="globe_icon"/> Covid Tracker</h1>
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
                active={casesType === "cases"}
                onClick={() => setCasesType("cases")}
                title="CoronaVirus Cases"
                cases={prettyFormat(countryInfo.todayCases)}
                total={prettyFormat(countryInfo.cases)}
              />

              <InfoBoxes
                green
                active={casesType === "recovered"}
                onClick={() => setCasesType("recovered")}
                title="Recovered"
                cases={prettyFormat(countryInfo.todayRecovered)}
                total={prettyFormat(countryInfo.recovered)}
              />

              <InfoBoxes
                active={casesType === "deaths"}
                onClick={() => setCasesType("deaths")}
                title="Deaths"
                cases={prettyFormat(countryInfo.todayDeaths)}
                total={prettyFormat(countryInfo.deaths)}
              />
            </div>

            <Map
              casesType={casesType}
              countries={mapCountries}
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>
          <div className="app_right">
            <Card>
              <CardContent>
                <h3>Live Cases by Country</h3>
                <Table data={tableData} />
                <h3>Worldwide new {casesType}</h3>
                <LineGraph casesType={casesType} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
