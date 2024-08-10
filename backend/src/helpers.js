const RAINFALL_RISE = 5;
const TEMPERATURE_RISE = 3;

export function generateClimateData(forecastDays) {
  // CODE FOR TASK 3.2 -------------------------------------------

  const temperatureFall = Math.random() > 0.5;

  let rainfall = Math.floor(Math.random() * 451) + 50;

  let temperature = Math.floor(Math.random() * 45) - 10;

  const forecast = [];

  for (let i = 0; i < forecastDays; i++) {
    rainfall += RAINFALL_RISE;
    temperature += temperatureFall ? -TEMPERATURE_RISE : TEMPERATURE_RISE;

    forecast.push({
      rainfall,
      temperature,
    });
  }

  return {
    rainfall: rainfall - RAINFALL_RISE * forecastDays, // Return the initial rainfall value
    temperature: temperatureFall
      ? temperature + TEMPERATURE_RISE * forecastDays
      : temperature - TEMPERATURE_RISE * forecastDays, // Return the initial temperature value
    forecast,
  };

  // END OF CODE FOR TASK 3.2 ------------------------------------
}
