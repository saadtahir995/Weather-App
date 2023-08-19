import React, { useReducer, useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs';

export default function Home() {

    const initialState = {
        loading: false,
        error: '',
        weather: {},
        City: '',
        ip: '',
        time: '',
        minute: '',
    }
    const [Tmp, setTmp] = useState('');
    const API_KEY = "3b65cd619166c9941c524e9805418168";
    const IP_API = "https://api.ipify.org?format=json";
    const fetchIP = async () => {
        try {
            const response = await fetch(IP_API);
            const data = await response.json();
            console.log(data);
            dispatch({ type: 'IP_CHANGE', payload: data.ip })

        }
        catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchIP()
    }, []);



    const reducer = (state, action) => {
        switch (action.type) {
            case 'FETCH_REQUEST':
                return {
                    ...state,
                    loading: true,
                    error: ''
                }
            case 'FETCH_SUCCESS':
                return {
                    ...state,
                    loading: false,
                    weather: action.payload,
                    error: '',
                    City: '',
                }
            case 'FETCH_ERROR':
                return {
                    ...state,
                    loading: false,
                    weather: {},
                    error: 'City Not Found!'
                }
            case 'CITY_CHANGE':
                return {
                    ...state,
                    City: action.payload,
                }
            case 'IP_CHANGE':
                return {
                    ...state,
                    ip: action.payload
                }
            case 'TIME_CHANGE':
                return {
                    ...state,
                    time: action.payload,
                    minute: action.payload2
                }
            default:
                return state
        }
    }
    const [state, dispatch] = useReducer(reducer, initialState)
    const fetchweather = async () => {
        try {
            dispatch({ type: 'FETCH_REQUEST' })
            setTmp('');
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${state.City}&appid=${API_KEY}`)
            const data = await response.json();
            console.log(data);
            if (data.cod === '404') {
                dispatch({ type: 'FETCH_ERROR' })
                return
            }
            try {
                const resp = await fetch(`http://192.168.43.52:9000/api/gettime/time`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(data),
                })
                const time = await resp.json();
                dispatch({ type: 'FETCH_SUCCESS', payload: data })
                dispatch({ type: 'TIME_CHANGE', payload: time.hour, payload2: time.minute })

            }

            catch (error) {
                console.log(error);
            }

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (state.time) {
            const noonHour = (5 + 19) / 2;

            if (state.time >= 6 && state.time < noonHour) {
                document.body.style.color = 'black';
                document.body.style.backgroundImage = "url('https://i0.wp.com/pixahive.com/wp-content/uploads/2021/01/Nature-view-in-morning-time-265756-pixahive.jpg?fit=2560%2C1920&ssl=1')";
            } else if (state.time >= noonHour && state.time < 19) {
                document.body.style.color = 'black';
                document.body.style.backgroundImage = "url('https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/A_good_afternoon_%286933189752%29.jpg/1200px-A_good_afternoon_%286933189752%29.jpg')";
            } else {
                document.body.style.color = 'white';
                document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1528818955841-a7f1425131b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80')";
            }
        }
    }, [state.sunrise, state.sunset, state.time])

    useEffect(() => {
        if (state.City) {
            fetchweather();
        }
    }, [state.City])
    const HandleGetLoc = async () => {
        try {
            dispatch({ type: 'FETCH_REQUEST' })
            const response = await fetch("http://192.168.43.52:9000/api/getlocation", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ ip: state.ip })
            }
            )
            const data = await response.json();
            dispatch({ type: 'CITY_CHANGE', payload: data.data.city_name });
        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='container'>
            <h3>Weather App</h3>
            <input type="text" placeholder="City" style={{ borderRadius: '10px' }} value={Tmp} onChange={(e) => setTmp(e.target.value)} />
            <button style={{ borderRadius: '10px' }} onClick={() => dispatch({ type: 'CITY_CHANGE', payload: Tmp })}><BsSearch /></button> <br />
            <button onClick={HandleGetLoc} style={{ borderRadius: '10px' }}>Current location Weather</button>
            {state.loading ? <h3>Loading...</h3> : (state.weather?.main?.temp ? (<><h3>Location : {state.weather.name},{state.weather.sys.country}</h3><h3>Current Weather : {Math.floor(state.weather?.main?.temp - 273.15)}C</h3> <h3>Real feel : {Math.floor(state.weather.main.feels_like - 273.15)}C</h3> <h3>Humidity: {state.weather.main.humidity}%</h3> <h3>{state.weather.weather[0].description}</h3><h3>Current time : {state.time}:{state.minute < 10 ? <>0</> : null}{state.minute}</h3></>) : null)}
            {state.error ? <h3>{state.error}</h3> : null}

        </div>
    )
}
