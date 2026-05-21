export const formatTIN = (value) => {
  if (!value) return "";
  const val = value.replace(/\D/g, "");
  let formatted = "";
  for (let i = 0; i < val.length && i < 12; i++) {
    if (i > 0 && i % 3 === 0) formatted += "-";
    formatted += val[i];
  }
  return formatted;
};

export const formatContactNo = (value) => {
  if (!value) return "";
  const val = value.replace(/\D/g, "");
  
  if (val.startsWith("02")) {
    // Landline: (02) XXXX-XXXX (10 digits)
    let formatted = "(02) ";
    const mainPart = val.slice(2, 10);
    for (let i = 0; i < mainPart.length; i++) {
      if (i === 4) formatted += "-";
      formatted += mainPart[i];
    }
    return formatted;
  } else {
    // Mobile: 09XX-XXX-XXXX (11 digits)
    let formatted = "";
    for (let i = 0; i < val.length && i < 11; i++) {
      if (i === 4 || i === 7) formatted += "-";
      formatted += val[i];
    }
    return formatted;
  }
};

