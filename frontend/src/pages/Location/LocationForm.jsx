import { useState } from "react";
import Select from "react-select";

import { Country, State, City } from "country-state-city";

function LocationForm() {
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  const countries = Country.getAllCountries();

  const states = country ? State.getStatesOfCountry(country.isoCode) : [];

  const cities =
    country && state
      ? City.getCitiesOfState(country.isoCode, state.isoCode)
      : [];

  return (
    <div>
      {/* COUNTRY */}
      <Select
        placeholder="Select Country"
        options={countries}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.isoCode}
        onChange={(value) => {
          setCountry(value);
          setState(null);
          setCity(null);
        }}
      />

      {/* STATE */}
      <Select
        placeholder="Select State"
        options={states}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.isoCode}
        onChange={(value) => {
          setState(value);
          setCity(null);
        }}
      />

      {/* CITY */}
      <Select
        placeholder="Select City"
        options={cities}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.name}
        onChange={(value) => setCity(value)}
      />
    </div>
  );
}

export default LocationForm;
