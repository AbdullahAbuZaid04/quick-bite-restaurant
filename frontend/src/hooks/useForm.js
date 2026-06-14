import { useState } from "react";
import { authValidation } from "../utils/authValidations";

export function useForm(initialState, onSuccess, type) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newErrors, isFormValid } = authValidation(formData, type);

    if (isFormValid) {
      setLoading(true);
      try {
        await onSuccess();
      } catch (serverError) {
        setErrors({ server: serverError.message });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return {
    formData,
    errors,
    setErrors,
    loading,
    setLoading,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
  };
}
