import { useState } from "react";

export function useTogglePassword() {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return {
    showPassword,
    togglePasswordVisibility
  };
}
