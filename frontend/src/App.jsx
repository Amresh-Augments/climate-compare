import "./App.css";
import { CloudRain, Triangle } from "lucide-react";
import { useEffect, useState } from "react";
import { Select, Table, message } from "antd";
import axios from "axios";
import { makeReadable } from "../lib/helpers";

const { Option } = Select;
const MAX_FORECAST_DAYS = 3;

function App() {
  const [jwt, setJwt] = useState(null);
  const [countries, setCountries] = useState([]);
  const [country1, setCountry1] = useState("None");
  const [country2, setCountry2] = useState("None");
  const [climateData, setClimateData] = useState(null);
  useEffect(() => {
    // Authenticate and get JWT
    const authenticate = async () => {
      try {
        const response = await axios.post("http://localhost:3000/login", {
          username: "teamssquared_xyz",
          password: "Z4uYEQWOSPBIJNY",
        });
        setJwt(response.data.token);
      } catch (error) {
        console.error("Authentication error:", error);
        message.error("Authentication failed");
      }
    };
    authenticate();
  }, []);

  useEffect(() => {
    if (jwt) {
      // Fetch countries
      const fetchCountries = async () => {
        try {
          const response = await axios.get("http://localhost:3000/countries", {
            headers: { Authorization: `Bearer ${jwt}` },
          });
          setCountries(response.data);
        } catch (error) {
          console.error("Error fetching countries:", error);
          message.error("Failed to fetch countries");
        }
      };
      fetchCountries();
    }
  }, [jwt]);

  useEffect(() => {
    if (country1 !== "None" && country2 !== "None" && country1 !== country2) {
      // Fetch climate data for both countries
      const fetchClimateData = async () => {
        try {
          const [data1, data2] = await Promise.all([
            axios.get(
              `http://localhost:3000/climate/${country1}?forecastDays=${MAX_FORECAST_DAYS}`,
              {
                headers: { Authorization: `Bearer ${jwt}` },
              }
            ),
            axios.get(
              `http://localhost:3000/climate/${country2}?forecastDays=${MAX_FORECAST_DAYS}`,
              {
                headers: { Authorization: `Bearer ${jwt}` },
              }
            ),
          ]);
          setClimateData([data1.data, data2.data]);
        } catch (error) {
          console.error("Error fetching climate data:", error);
          message.error("Failed to fetch climate data");
        }
      };
      fetchClimateData();
    }
  }, [country1, country2, jwt]);

  const handleCountryChange = (value, setCountry) => {
    setCountry(value);
  };

  useEffect(() => {
    if (country1 !== "None" && country2 !== "None" && country1 !== country2) {
      // Fetch climate data for both countries
      const fetchClimateData = async () => {
        try {
          const [data1, data2] = await Promise.all([
            axios.get(
              `http://localhost:3000/climate/${country1}?forecastDays=${MAX_FORECAST_DAYS}`,
              {
                headers: { Authorization: `Bearer ${jwt}` },
              }
            ),
            axios.get(
              `http://localhost:3000/climate/${country2}?forecastDays=${MAX_FORECAST_DAYS}`,
              {
                headers: { Authorization: `Bearer ${jwt}` },
              }
            ),
          ]);
          setClimateData([data1.data, data2.data]);
        } catch (error) {
          console.error("Error fetching climate data:", error);
          message.error("Failed to fetch climate data");
        }
      };
      fetchClimateData();
    }
  }, [country1, country2, jwt]);

  useEffect(() => {
    if (country1 !== "None" && country2 !== "None" && country1 !== country2) {
      // Fetch climate data for both countries
      const fetchClimateData = async () => {
        try {
          const [data1, data2] = await Promise.all([
            axios.get(
              `http://localhost:3000/climate/${country1}?forecastDays=${MAX_FORECAST_DAYS}`,
              {
                headers: { Authorization: `Bearer ${jwt}` },
              }
            ),
            axios.get(
              `http://localhost:3000/climate/${country2}?forecastDays=${MAX_FORECAST_DAYS}`,
              {
                headers: { Authorization: `Bearer ${jwt}` },
              }
            ),
          ]);
          setClimateData([data1.data, data2.data]);
        } catch (error) {
          console.error("Error fetching climate data:", error);
          message.error("Failed to fetch climate data");
        }
      };
      fetchClimateData();
    }
  }, [country1, country2, jwt]);

  const renderTable = () => {
    const columns = [
      {
        title: "Country",
        dataIndex: "country",
        key: "country",
      },
      {
        title: "Temperature (°C)",
        dataIndex: "temperature",
        key: "temperature",
        render: (text, record) => (
          <span>
            {text} {record.isMaxTemp && <Triangle />}
          </span>
        ),
      },
      {
        title: "Rainfall (mm)",
        dataIndex: "rainfall",
        key: "rainfall",
        render: (text, record) => (
          <span>
            {text} {record.isMaxRain && <CloudRain />}
          </span>
        ),
      },
      {
        title: "Tomorrow",
        dataIndex: "forecast1",
        key: "forecast1",
      },
      {
        title: "Day After",
        dataIndex: "forecast2",
        key: "forecast2",
      },
      {
        title: "Day After That",
        dataIndex: "forecast3",
        key: "forecast3",
      },
    ];

    const data = climateData
      ? climateData.map((data, index) => {
          const isMaxTemp =
            data.temperature > climateData[1 - index].temperature;
          const isMaxRain = data.rainfall > climateData[1 - index].rainfall;
          return {
            key: index,
            country: data.country ? makeReadable(data.country) : "Unknown",
            temperature: `${data.temperature}°C`,
            rainfall: `${data.rainfall}mm`,
            isMaxTemp,
            isMaxRain,
            forecast1: data.forecast[0]
              ? `${data.forecast[0].temperature}°C / ${data.forecast[0].rainfall}mm`
              : "N/A",
            forecast2: data.forecast[1]
              ? `${data.forecast[1].temperature}°C / ${data.forecast[1].rainfall}mm`
              : "N/A",
            forecast3: data.forecast[2]
              ? `${data.forecast[2].temperature}°C / ${data.forecast[2].rainfall}mm`
              : "N/A",
          };
        })
      : [];
    console.log(data);
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  return (
    <div>
      <div>
        <Select
          value={country1}
          onChange={(value) => handleCountryChange(value, setCountry1)}
          style={{ width: 200, marginRight: 20 }}
        >
          <Option value="None">None</Option>
          {countries.map((country) => (
            <Option key={country} value={country}>
              {makeReadable(country)}
            </Option>
          ))}
        </Select>
        <Select
          value={country2}
          onChange={(value) => handleCountryChange(value, setCountry2)}
          style={{ width: 200 }}
        >
          <Option value="None">None</Option>
          {countries.map((country) => (
            <Option key={country} value={country}>
              {makeReadable(country)}
            </Option>
          ))}
        </Select>
      </div>
      <div className="message">
        {country1 === "None" || country2 === "None" || country1 === country2 ? (
          <p>Please select two different countries to compare climates</p>
        ) : null}
      </div>
      {renderTable()}
    </div>
  );
}

export default App;
