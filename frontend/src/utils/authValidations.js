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

  return {
    newErrors,
    isFormValid: Object.keys(newErrors).length === 0
  };
}