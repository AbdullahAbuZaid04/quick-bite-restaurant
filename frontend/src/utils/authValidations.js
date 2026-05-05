export const authValidation = (formData, type = "login") => {

  let newErrors = {};

  if (type === "register") {
    if (formData.fullName.trim() === "") {
      newErrors.fullName = "الاسم الكامل مطلوب";
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
  }

  if (formData.password.length < 6) {
    newErrors.password = "كلمة المرور يجب أن لا تقل عن 6 خانات";
  }

  if (Object.keys(newErrors).length === 0) {
    const isUserLogged = (formData.email === "admin@quickbit.com" && formData.password === "admin123") || (formData.email === "user@quickbit.com" && formData.password === "user123");

    if (!isUserLogged) {
      newErrors.email = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      newErrors.password = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
    }
  }

  return {
    newErrors,
    isFormValid: Object.keys(newErrors).length === 0
  };
}