import { createContext, useContext, useEffect, useReducer } from "react";
import {
    createCity,
    deleteCity,
    getCities,
    getCity,
} from "../services/apiCities";

const CitiesContext = createContext();

const initialState = {
    cities: [],
    city: null,
    loading: false,
    error: null,
};

const reducer = function (cState, action) {
    switch (action.type) {
        case "cities/load": {
            const cities = action.payload;
            return { ...cState, cities: cities, loading: false };
        }

        case "city/load": {
            const city = action.payload;
            return { ...cState, city: city, loading: false };
        }

        case "city/update": {
            const id = action.payload.id;
            const newCity = action.payload.newCity;

            return {
                ...cState,
                cities: cState.cities.map(function (city) {
                    if (city.id === id) return newCity;
                    else return city;
                }),
                loading: false,
            };
        }

        case "city/delete": {
            const id = action.payload;
            return {
                ...cState,
                cities: cState.cities.filter(function (city) {
                    if (city.id === id) return false;
                    else return true;
                }),
                loading: false,
            };
        }

        case "city/create": {
            const newCity = action.payload;
            return {
                ...cState,
                cities: [...cState.cities, newCity],
                loading: false,
            };
        }
        case "reject": {
            const error = action.payload;
            return {
                ...cState,
                error: error,
                loading: false,
            };
        }

        case "loading": {
            return { ...cState, loading: false };
        }
        default:
            return new Error(
                "no action found with the name : `${action.type}`"
            );
    }
};

const CitiesProvider = function ({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { cities, city, loading, error } = state;
    console.log(cities);

    useEffect(function () {
        async function fetchCities() {
            try {
                dispatch({ type: "loading" });
                const data = await getCities();
                dispatch({ type: "cities/load", payload: data });
            } catch (error) {
                dispatch({ type: "error", payload: error.message });
            }
        }
        fetchCities();
    }, []);

    // to load city
    async function handleLoadCity(id) {
        try {
            dispatch({ type: "loading" });
            const data = await getCity(id);
            dispatch({ type: "city/load", payload: data });
        } catch (error) {
            dispatch({ type: "error", payload: error.message });
        }
    }

    async function handleAddCity(newCity) {
        try {
            dispatch({ type: "loading" });
            const data = await createCity(newCity);
            dispatch({ type: "city/create", payload: data });
        } catch (error) {
            dispatch({ type: "error", payload: error.message });
        }
    }

    async function handleRemoveCity(id) {
        try {
            dispatch({ type: "loading" });
            await deleteCity(id);
            dispatch({ type: "city/delete", payload: id });
        } catch (error) {
            dispatch({ type: "error", payload: error.message });
        }
    }

    async function handleEditCity(id, updatedCity) {
        try {
            dispatch({ type: "loading" });
            const data = await updatedCity(id, updatedCity);
            dispatch({ type: "city/update", payload: data });
        } catch (error) {
            dispatch({ type: "error", payload: error.message });
        }
    }

    const valuesObj = {
        cities: cities,
        city: city,
        loading: loading,
        error: error,
        handleLoadCity: handleLoadCity,
        handleAddCity: handleAddCity,
        handleRemoveCity: handleRemoveCity,
        handleEditCity: handleEditCity,
    };

    return (
        <CitiesContext.Provider value={valuesObj}>
            {children}
        </CitiesContext.Provider>
    );
};

const useCities = function () {
    const context = useContext(CitiesContext);

    if (context === undefined) {
        throw new Error("Trying to access context outside the provider");
    }

    return context;
};

export { CitiesProvider, useCities };
