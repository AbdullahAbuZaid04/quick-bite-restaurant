import { useState } from "react";
import { authValidation } from "../utils/authValidations";

export const useForm = (initialValues, onSuccess, type) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialValues)
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { newErrors, isFormValid } = authValidation(formData, type);
    if (isFormValid) {
      onSuccess();
    } else {
      setErrors(newErrors);
    }
  }

  return {
    formData,
    errors,
    setErrors,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
  }
}