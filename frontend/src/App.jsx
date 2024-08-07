import "./App.css";

import {
  CloudRain,
  LucideArrowLeftRight,
  Triangle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { makeReadable } from "../../backend/src/helpers";

const MAX_FORECAST_DAYS = 3;

function App() {
  const [token, setToken] = useState(null);
  const [countries, setCountries] = useState([]);

  const [countryA, setCountryA] = useState({ country: "none", climate: null });
  const [countryB, setCountryB] = useState({ country: "none", climate: null });

  async function handleOnChangeCountry(e, setCountry) {
    if (e.target.value === "none") {
      setCountry({ country: e.target.value, climate: null });
      return;
    }
    const response = await fetch(
      `http://localhost:3000/climate/${e.target.value}?` +
        new URLSearchParams({
          forecastDays: MAX_FORECAST_DAYS,
        }).toString(),
      {
        method: "GET",
        headers: new Headers({ Authorization: `Bearer ${token}` }),
      }
    );
    const climate = await response.json();
    setCountry({ country: e.target.value, climate: climate });
  }

  useEffect(() => {
    async function login() {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        body: JSON.stringify({
          username: "teamssquared_xyz",
          password: "Z4uYEQWOSPBIJNY",
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      const data = await response.json();
      setToken(data.token);
      getCountries(data.token);
    }
    async function getCountries(token) {
      const response = await fetch("http://localhost:3000/countries", {
        method: "GET",
        headers: new Headers({ Authorization: `Bearer ${token}` }),
      });
      const countries = await response.json();
      setCountries(["none", ...countries]);
    }
    login();
  }, []);

  let countryAHigherTemp = null;
  if (countryA.climate && countryB.climate) {
    countryAHigherTemp =
      countryA.climate.temperature > countryB.climate.temperature;
  }

  let countryAHigherRainfall = null;
  if (countryA.climate && countryB.climate) {
    countryAHigherRainfall =
      countryA.climate.rainfall > countryB.climate.rainfall;
  }

  return (
    <div id="climate-container">
      <h1>Climate Compare</h1>
      <div id="country-selectors">
        <div>
          <label htmlFor="countryA">Country A</label>
          <select
            name="countryA"
            id="countryA"
            onChange={(e) => handleOnChangeCountry(e, setCountryA)}
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {makeReadable(country)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <LucideArrowLeftRight height={40} width={40} strokeWidth={1} />
        </div>
        <div>
          <label htmlFor="countryB">Country B</label>
          <select
            name="countryB"
            id="countryB"
            onChange={(e) => handleOnChangeCountry(e, setCountryB)}
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {makeReadable(country)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {countryA.climate &&
      countryB.climate &&
      countryA.country !== countryB.country ? (
        <table id="climate-data">
          <tbody>
            <tr>
              <th rowSpan={2}>Country</th>
              <th rowSpan={2}>Temperature</th>
              <th rowSpan={2}>Rainfall</th>
              <th colSpan={MAX_FORECAST_DAYS}>Forecast</th>
            </tr>
            <tr>
              {Array(MAX_FORECAST_DAYS)
                .fill()
                .map((_, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() + index + 1);
                  return (
                    <td key={`date-${index}`} className="date-header-cell">
                      {date.toLocaleDateString("en-US")}
                    </td>
                  );
                })}
            </tr>
            <tr>
              <td rowSpan={2}>{makeReadable(countryA.country)}</td>
              <td rowSpan={2}>
                {countryA.climate.temperature}°C
                {countryA.climate.temperature >
                  countryB.climate.temperature && (
                  <Triangle
                    fill="#ff0000"
                    strokeWidth={0}
                    height={15}
                    width={15}
                  />
                )}
              </td>
              <td rowSpan={2}>
                {countryA.climate.rainfall} mm
                {countryA.climate.rainfall > countryB.climate.rainfall && (
                  <CloudRain
                    fill="#ff0000"
                    stroke="#ff0000"
                    height={15}
                    width={15}
                  />
                )}
              </td>
              {countryA.climate.forecast.map((data, index) => {
                return (
                  <td key={`countryA-temperature-${index}`}>
                    {data.temperature}°C
                  </td>
                );
              })}
            </tr>
            <tr>
              {countryA.climate.forecast.map((data, index) => {
                return (
                  <td key={`countryA-rainfall-${index}`}>{data.rainfall} mm</td>
                );
              })}
            </tr>
            <tr>
              <td rowSpan={2}>{makeReadable(countryB.country)}</td>
              <td rowSpan={2}>
                {countryB.climate.temperature}°C
                {countryB.climate.temperature >
                  countryA.climate.temperature && (
                  <Triangle
                    fill="#ff0000"
                    strokeWidth={0}
                    height={15}
                    width={15}
                  />
                )}
              </td>
              <td rowSpan={2}>
                {countryB.climate.rainfall} mm
                {countryB.climate.rainfall > countryA.climate.rainfall && (
                  <CloudRain
                    fill="#ff0000"
                    stroke="#ff0000"
                    height={15}
                    width={15}
                  />
                )}
              </td>
              {countryB.climate.forecast.map((data, index) => {
                return (
                  <td key={`countryB-temperature-${index}`}>
                    {data.temperature}°C
                  </td>
                );
              })}
            </tr>
            <tr>
              {countryB.climate.forecast.map((data, index) => {
                return (
                  <td key={`countryB-rainfall-${index}`}>{data.rainfall} mm</td>
                );
              })}
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="muted">
          Please select two different countries to compare climates
        </p>
      )}
    </div>
  );
}

export default App;
