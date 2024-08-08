const RAINFALL_RISE = 5;
const TEMPERATURE_RISE = 3;

export function generateClimateData(country, forecastDays) {
  const baseRainfall = 300;
  const baseTemperature = 17;
  const forecast = [];

  for (let i = 0; i < forecastDays; i++) {
    const temperature = baseTemperature - i * TEMPERATURE_RISE;
    const rainfall = baseRainfall + i * RAINFALL_RISE;

    forecast.push({
      rainfall: rainfall,
      temperature: temperature,
    });
  }

  return {
    rainfall: baseRainfall,
    temperature: baseTemperature,
    forecast: forecast,
    country: country,
  };
}
