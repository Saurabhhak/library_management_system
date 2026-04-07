import { useEffect, useState } from "react";
import { getStates, getCitiesByState } from "../services/states.cities.service";

export const useFetchStatesCities = (state_id) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getStates().then((res) => setStates(res?.data?.data || []));
  }, []);

  useEffect(() => {
    if (!state_id) return;
    getCitiesByState(state_id).then((res) => setCities(res?.data?.data || []));
  }, [state_id]);

  return { states, cities };
};
