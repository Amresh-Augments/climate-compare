import axios from 'axios';
import './App.css';

import { CloudRain, LucideArrowLeftRight, Triangle } from 'lucide-react';
import { useEffect, useState } from 'react';

// import { makeReadable } from '../../backend/src/helpers';

const MAX_FORECAST_DAYS = 3;

function App() {
  // CODE FOR TASK 4 -------------------------------------------
  const [countries, setCountries] = useState([]);
  const [countryA, setCountryA] = useState('None');
  const [countryB, setCountryB] = useState('None');
  const [climateDataA, setClimateDataA] = useState(null);
  const [climateDataB, setClimateDataB] = useState(null);
  const [error, setError] = useState('');
  const [jwt, setJwt] = useState('');

  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
          username: 'admin',
          password: 'password123',
        });
        localStorage.setItem('jwtToken', response.data.token);
        setJwt(response.data.token);
      } catch (err) {
        console.error('Authentication failed:', err);
      }
    };

    authenticateUser();
  }, []);

  useEffect(() => {
    if (jwt) {
      // Fetch the list of countries once the JWT is set
      const fetchCountries = async () => {
        const token = localStorage.getItem('jwtToken');
        try {
          const response = await axios.get(`${API_BASE_URL}/countries`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(response.data.countries);
          setCountries(response.data.countries);
        } catch (err) {
          console.error('Failed to fetch countries:', err);
          console.error(
            'Failed to fetch countries:',
            err.response ? err.response.data : err.message
          );
        }
      };

      fetchCountries();
    }
  }, [jwt]);

  useEffect(() => {
    // Validate the selected countries and fetch climate data
    const validateCountries = () => {
      if (countryA === 'None' || countryB === 'None' || countryA === countryB) {
        setError('Please select two different countries to compare climates');
        setClimateDataA(null);
        setClimateDataB(null);
      } else {
        setError('');
        fetchClimateData(countryA, setClimateDataA);
        fetchClimateData(countryB, setClimateDataB);
      }
    };

    const fetchClimateData = async (country, setClimateData) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/climate/${country}`, {
          headers: { Authorization: `Bearer ${jwt}` },
          params: { forecastDays: 3 },
        });
        setClimateData(response.data);
      } catch (err) {
        console.error(`Failed to fetch climate data for ${country}:`, err);
      }
    };

    if (jwt && countryA && countryB) {
      validateCountries();
    }
  }, [countryA, countryB, jwt]);

  const makeReadable = (text) => {
    return text
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="App">
      <h1>Climate Compare</h1>
      <div className="country-selection">
        <div>
          <label htmlFor="countryA">Country A:</label>
          <select
            id="countryA"
            value={countryA}
            onChange={(e) => setCountryA(e.target.value)}
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {makeReadable(country)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="countryB">Country B:</label>
          <select
            id="countryB"
            value={countryB}
            onChange={(e) => setCountryB(e.target.value)}
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {makeReadable(country)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {!error && climateDataA && climateDataB && (
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Temperature (°C)</th>
              <th>Rainfall (mm)</th>
              <th>Day +1</th>
              <th>Day +2</th>
              <th>Day +3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{makeReadable(countryA)}</td>
              <td>{climateDataA.temperature} °C</td>
              <td>{climateDataA.rainfall} mm</td>
              {climateDataA.forecast.map((day, index) => (
                <td key={index}>
                  {day.temperature} °C / {day.rainfall} mm
                </td>
              ))}
            </tr>
            <tr>
              <td>{makeReadable(countryB)}</td>
              <td>{climateDataB.temperature} °C</td>
              <td>{climateDataB.rainfall} mm</td>
              {climateDataB.forecast.map((day, index) => (
                <td key={index}>
                  {day.temperature} °C / {day.rainfall} mm
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );

  // END OF CODE FOR TASK 4 ------------------------------------
}

export default App;
