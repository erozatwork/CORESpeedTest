import { useMemo, useState, useEffect } from "react";
import { CitiesMunicipalities, Location } from "@shared/location/location";

const getLocation = () => {
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);

  const getCitiesByProvince = (provinceCode) => {
    if (!provinceCode) return CitiesMunicipalities;

    return CitiesMunicipalities.filter(
      (item) => item.provinceCode === provinceCode
    );
  };

  const getProvinceByCode = (provinceCode) => {
    if (!provinceCode) return CitiesMunicipalities;

    return Location.filter((item) => item.code === provinceCode)[0];
  };

  const cities = useMemo(() => {
    return getCitiesByProvince(province);
  }, [province]);

  useEffect(() => {
    if (city && !cities.some((c) => c.code === city.code)) {
      setCity(null);
    }
  }, [province]);

  return { province, setProvince, city, setCity, cities, getProvinceByCode };
};

export { getLocation };
