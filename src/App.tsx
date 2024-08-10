import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState(""); 
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null); 
  const [error, setError] = useState<string | null>(null); 
  const [location, setLocation] = useState<{ name: string; country: string } | null>(null); 

  const fetchWeather = async (location: string) => {
    try {
      const response = await axios.get(
        "https://api.weatherapi.com/v1/forecast.json",
        {
          params: {
            key: "36613b6f51f84faf95a190803240908", 
            q: location,
            days: 7,
            aqi: "no",
          },
        }
      );

      
      setWeather(response.data.current);
      setForecast(response.data.forecast.forecastday); 
      setLocation({
        name: response.data.location.name,
        country: response.data.location.country,
      }); 
      setError(null); 
      console.log(response.data); 
    } catch (error: any) {
      setError(`Hata: ${error.response?.data?.error?.message || error.message}`);
      console.error("Hata:", error.response?.data || error.message);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      fetchWeather(query);
    }
  };

  return (
    <div>
      <h1 className="h1-1">Weather App</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="City Name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-no-border"
          spellCheck="false" 
        />
      </form>
      {error && <p className="error-message">{error}</p>}
      {weather && forecast && location && (
        <div className="card">
          <h2>
            {forecast[0]?.date} 
          </h2>
          <p>
            {location.name}, {location.country}
          </p>
          <img
            src={weather?.condition?.icon}
            alt={weather?.condition?.text}
            style={{ width: "70px", height: "70px" }}
          />
          <p className="c1">{Math.round(weather?.temp_c)}°C</p>
          <h2 className="pb-7">Weekly Weather</h2>
          <div className="weekly-forecast">
            {forecast.map((day: any, index: number) => (
              <div key={index} className="weekly-day">
                 <strong>{day.date}</strong> <p className="m-2">
                 {Math.round(day.day.avgtemp_c)}°C,
                  
                </p>
                <img
                  src={day.day.condition.icon}
                  alt={day.day.condition.text}
                  style={{ width: "30px", height: "30px" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
