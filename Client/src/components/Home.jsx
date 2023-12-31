import React, { useReducer, useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import '../stylesheets/Home.css'

export default function Home() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(true);
  const [userConsent, setUserConsent] = useState(false);

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
    if (state.time) {
      const noonHour = (5 + 19) / 2;

      if (state.time >= 6 && state.time < noonHour) {
        document.body.style.color = "black";
        document.body.style.backgroundImage =
          "url('https://i0.wp.com/pixahive.com/wp-content/uploads/2021/01/Nature-view-in-morning-time-265756-pixahive.jpg?fit=2560%2C1920&ssl=1')";
      } else if (state.time >= noonHour && state.time < 19) {
        document.body.style.color = "black";
        document.body.style.backgroundImage =
          "url('https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/A_good_afternoon_%286933189752%29.jpg/1200px-A_good_afternoon_%286933189752%29.jpg')";
      } else {
        document.body.style.color = "white";
        document.body.style.backgroundImage =
          "url('https://images.unsplash.com/photo-1528818955841-a7f1425131b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80')";
      }
    }
  }, [state.sunrise, state.sunset, state.time]);

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
  return (
    

  
    <div className='container'>
      {userConsent ? (<>
        
      
      <h1 className='app-title'>Weather App</h1>
      <div className='search-container'>
        <input
          type="text"
          placeholder="Enter City"
          className='search-input'
          value={Tmp}
          onChange={(e) => setTmp(e.target.value)}
        />
        <button className='search-button' onClick={() => dispatch({ type: 'CITY_CHANGE', payload: Tmp })}>
          <BsSearch />
        </button>
      </div>
      <button className='location-button' onClick={HandleGetLoc}>
        Get Weather for Current Location
      </button>

      <div className='weather-details'>
        {state.loading ? (
 <div className='spinner-container'>
 <div className='spinner-border text-primary' role='status'>
   <span className='visually-hidden'>Loading...</span>
 </div>
</div>) : state.weather?.main?.temp ? (
          <>
            <h2 className='temperature'>
              {Math.floor(state.weather?.main?.temp - 273.15)}<sup>°C</sup>
            </h2>
            <h3 className='weather-description'>{state.weather.weather[0].description}</h3>
            <p className='feels-like'>
              Feels Like: {Math.floor(state.weather.main.feels_like - 273.15)}<sup>°C</sup>
            </p>
            <p className='location'>
              {state.weather.name}, {state.weather.sys.country}
            </p>
            <p className='time'>
              {state.time}:{state.minute < 10 ? <>0</> : null}
              {state.minute}
            </p>
          </>
        ) : (
          <h3 className='error-message'>{state.error}</h3>
        )}
      </div>
      </> ) : (
        <PrivacyPolicyModal
          onClose={() => setShowPrivacyModal(false)}
          onConsent={handlePrivacyConsent}
        />
      )}
    </div>
    
    
      

  );
}
