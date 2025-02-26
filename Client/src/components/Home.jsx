import React, { useReducer, useEffect, useState, useCallback } from "react";
import { BsSearch, BsGeoAlt, BsThermometerHalf, BsWind, BsDroplet } from "react-icons/bs";
import { WiDaySunny, WiNightClear, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from "react-icons/wi";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import SearchSuggestions from "./SearchSuggestions";
import { preloadImages, getBackgroundForTime } from '../utils/backgroundManager';
import '../stylesheets/Home.css'

// Weather icon mapping
const weatherIcons = {
  '01d': WiDaySunny,
  '01n': WiNightClear,
  '02d': WiCloudy,
  '02n': WiCloudy,
  '03d': WiCloudy,
  '03n': WiCloudy,
  '04d': WiCloudy,
  '04n': WiCloudy,
  '09d': WiRain,
  '09n': WiRain,
  '10d': WiRain,
  '10n': WiRain,
  '11d': WiThunderstorm,
  '11n': WiThunderstorm,
  '13d': WiSnow,
  '13n': WiSnow,
  '50d': WiFog,
  '50n': WiFog,
};

export default function Home() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(true);
  const [userConsent, setUserConsent] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handlePrivacyConsent = () => {
    setUserConsent(true);
  };
  
  const initialState = {
    loading: false,
    error: "",
    weather: {},
    City: "",
    ip: "",
    time: "",
    minute: "",
  };
  const [Tmp, setTmp] = useState("");
  const API_KEY = process.env.REACT_APP_WEATHER_API;
  const IP_API = "https://api.ipify.org?format=json";
  const fetchIP = async () => {
    try {
      const response = await fetch(IP_API);
      const data = await response.json();
      dispatch({ type: "IP_CHANGE", payload: data.ip });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchIP();
  }, []);

  const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return {
          ...state,
          loading: true,
          error: "",
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          loading: false,
          weather: action.payload,
          error: "",
          City: "",
        };
      case "FETCH_ERROR":
        return {
          ...state,
          loading: false,
          weather: {},
          error: "City Not Found!",
        };
      case "CITY_CHANGE":
        return {
          ...state,
          City: action.payload,
        };
      case "IP_CHANGE":
        return {
          ...state,
          ip: action.payload,
        };
      case "TIME_CHANGE":
        return {
          ...state,
          time: action.payload,
          minute: action.payload2,
        };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const fetchweather = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      setTmp("");
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${state.City}&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.cod === "404") {
        dispatch({ type: "FETCH_ERROR" });
        return;
      }
      try {
        const resp = await fetch(
          `${process.env.REACT_APP_BACKEND_API}/api/gettime/time`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
          }
        );
        const time = await resp.json();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        dispatch({
          type: "TIME_CHANGE",
          payload: time.hour,
          payload2: time.minute,
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // Preload images when component mounts
    preloadImages();
  }, []);

  useEffect(() => {
    if (state.time) {
      const { image, textColor } = getBackgroundForTime(state.time);
      document.body.style.color = textColor;
      document.body.style.backgroundImage = `url(${image})`;
    }
  }, [state.time]);

  useEffect(() => {
    if (state.City) {
      fetchweather();
    }
  }, [state.City]);
  const HandleGetLoc = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API}/api/getlocation`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ip: state.ip }),
        }
      );
      const data = await response.json();
      dispatch({ type: "CITY_CHANGE", payload: data.data.city_name });
    } catch (error) {
      console.log(error);
    }
  };

  // Debounce function to limit API calls
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Fetch city suggestions
  const fetchCitySuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API}/api/cities/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setSuggestions(data.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  // Debounced version of fetchCitySuggestions
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchCitySuggestions, 300),
    []
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setTmp(value);
    setShowSuggestions(true);
    debouncedFetchSuggestions(value);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (cityName) => {
    setTmp(cityName);
    dispatch({ type: 'CITY_CHANGE', payload: cityName });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='container'>
      {userConsent ? (
        <>
          <h1 className='app-title'>Weather App</h1>
          <div className='search-container glass-card'>
            <div className='search-input-group'>
              <input
                type="text"
                placeholder="Enter City"
                className='search-input'
                value={Tmp}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
              />
              <button 
                className='search-button' 
                onClick={() => {
                  dispatch({ type: 'CITY_CHANGE', payload: Tmp });
                  setShowSuggestions(false);
                }}
              >
                <BsSearch />
              </button>
            </div>
            <SearchSuggestions
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
              visible={showSuggestions}
            />
          </div>
          <div className="search-actions">
            <button className='location-button' onClick={HandleGetLoc}>
              <BsGeoAlt /> Current Location
            </button>
          </div>

          <div className='weather-details glass-card'>
            {state.loading ? (
              <div className='spinner-container'>
                <div className='spinner-border text-primary' role='status'>
                  <span className='visually-hidden'>Loading...</span>
                </div>
              </div>
            ) : state.weather?.main?.temp ? (
              <>
                <div className="weather-icon">
                  {React.createElement(
                    weatherIcons[state.weather.weather[0].icon] || WiDaySunny,
                    { size: 100 }
                  )}
                </div>
                <h2 className='temperature'>
                  {Math.floor(state.weather?.main?.temp - 273.15)}<sup>°C</sup>
                </h2>
                <h3 className='weather-description'>
                  {state.weather.weather[0].description}
                </h3>
                
                <div className="weather-info-grid">
                  <div className="weather-info-item">
                    <BsThermometerHalf />
                    <p className='feels-like'>
                      Feels Like: {Math.floor(state.weather.main.feels_like - 273.15)}°C
                    </p>
                  </div>
                  
                  <div className="weather-info-item">
                    <BsDroplet />
                    <p>Humidity: {state.weather.main.humidity}%</p>
                  </div>
                  
                  <div className="weather-info-item">
                    <BsWind />
                    <p>Wind: {Math.round(state.weather.wind.speed * 3.6)} km/h</p>
                  </div>
                </div>

                <div className="location-time-container">
                  <p className='location'>
                    <BsGeoAlt /> {state.weather.name}, {state.weather.sys.country}
                  </p>
                  <p className='time'>
                    {state.time}:{state.minute < 10 ? '0' : ''}{state.minute}
                  </p>
                </div>
              </>
            ) : (
              <h3 className='error-message'>{state.error}</h3>
            )}
          </div>
        </>
      ) : (
        <PrivacyPolicyModal
          onClose={() => setShowPrivacyModal(false)}
          onConsent={handlePrivacyConsent}
        />
      )}
    </div>
  );
}
