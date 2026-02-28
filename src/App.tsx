import axios from "axios";
import { useState } from "react";
import "./App.css";
import BackgroundScene from "./BackgroundScene";

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ name: string; country: string } | null>(null);

  const fetchWeather = async (searchLocation: string) => {
    setError(null);
    try {
      const response = await axios.get(
        "https://api.weatherapi.com/v1/forecast.json",
        {
          params: {
            key: "36613b6f51f84faf95a190803240908",
            q: searchLocation,
            days: 7,
            aqi: "no",
            lang: "tr",
          },
        }
      );

      const data = response.data;

      if (!data?.current || !data?.forecast?.forecastday?.length) {
        setError("Hava durumu verisi alınamadı.");
        return;
      }

      setWeather(data.current);
      setForecast(data.forecast.forecastday);
      setLocation({
        name: data.location?.name ?? "",
        country: data.location?.country ?? "",
      });
      setError(null);
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || err?.message || "Bilinmeyen hata";
      setError(`Hata: ${msg}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query?.trim();
    if (q) fetchWeather(q);
  };

  return (
    <>
      <BackgroundScene />
      <div className="app-wrap">
      <header className="search-header">
        <h1 className="search-title">Weather App</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Şehir adı girin..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            spellCheck="false"
            aria-label="Şehir ara"
          />
          <button type="submit" className="search-btn" aria-label="Ara">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>
      </header>
      {error && <p className="error-message">{error}</p>}
      {weather && forecast && location && (
        <div className="card">
          <h2>
            {forecast[0]?.date}
          </h2>
          <p>
            {location.name}, {location.country}
          </p>
          {weather?.condition?.icon && (
            <img
              src={weather.condition.icon.startsWith("//") ? "https:" + weather.condition.icon : weather.condition.icon}
              alt={weather.condition?.text ?? ""}
              style={{ width: "70px", height: "70px" }}
            />
          )}
          <p className="c1">{weather?.temp_c != null ? Math.round(Number(weather.temp_c)) : "—"}°C</p>
          {weather?.condition?.text && <p className="card-condition">{weather.condition.text}</p>}
          <h2 className="pb-7">Weekly Weather</h2>
          <div className="weekly-forecast">
            {forecast.slice(0, 7).map((day: any, index: number) => {
              const isToday = index === 0;
              const dayData = day?.day;
              const condition = isToday
                ? weather?.condition
                : dayData?.condition;
              const icon = condition?.icon ? (condition.icon.startsWith("//") ? "https:" + condition.icon : condition.icon) : "";
              const text = condition?.text ?? "";
              const tempNow = weather?.temp_c != null ? Math.round(Number(weather.temp_c)) : null;
              const avgC = dayData?.avgtemp_c != null ? Math.round(Number(dayData.avgtemp_c)) : null;
              return (
                <div key={day?.date_epoch ?? index} className="weekly-day">
                  <span className="weekly-day-date">
                    {day?.date ?? ""}
                    {isToday && <span className="weekly-day-badge">Şu an</span>}
                  </span>
                  <span className="weekly-day-temp" title={text}>
                    {isToday && tempNow != null
                      ? `${tempNow}°C`
                      : avgC != null
                        ? `${avgC}°C`
                        : "—"}
                  </span>
                  {icon ? (
                    <img
                      src={icon}
                      alt={text}
                      className="weekly-day-icon"
                      title={text}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div >
      )
      }
      </div>
    </>
  );
}

export default App;
