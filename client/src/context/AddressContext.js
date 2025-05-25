import { createContext, useContext, useState, useEffect } from "react";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  // localStorage'dan yükle
  useEffect(() => {
    const stored = localStorage.getItem("user_address");
    if (stored) {
      setAddress(JSON.parse(stored));
    }
  }, []);

  // localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("user_address", JSON.stringify(address));
  }, [address]);

  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
