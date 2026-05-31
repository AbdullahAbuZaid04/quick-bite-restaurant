export const authValidation = (formData, type = "login") => {

  let newErrors = {};

  if (type === "register") {
    if (formData.fullName.trim() === "") {
      newErrors.fullName = "Full name is required";
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    newErrors.email = "Please enter a valid email address";
  }

  if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  return {
    newErrors,
    isFormValid: Object.keys(newErrors).length === 0
  };
}