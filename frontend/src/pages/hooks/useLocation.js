import { useEffect, useState } from "react";

import { getCountries, getStates, getCities } from "../services/meta.service";

export const useLocation = (countryCode, stateCode) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (countryCode) {
      loadStates();
    }
  }, [countryCode]);

  useEffect(() => {
    if (countryCode && stateCode) {
      loadCities();
    }
  }, [countryCode, stateCode]);

  const loadCountries = async () => {
    const res = await getCountries();
    setCountries(res.data.data || []);
  };

  const loadStates = async () => {
    const res = await getStates(countryCode);
    setStates(res.data.data || []);
  };

  const loadCities = async () => {
    const res = await getCities(countryCode, stateCode);

    setCities(res.data.data || []);
  };

  return {
    countries,
    states,
    cities,
  };
};
