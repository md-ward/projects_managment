const setCookie = (cookieName: string, value: string) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30); // Add 30 days to the current date
  document.cookie = `${cookieName}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
};

const deleteCookie = (cookieName: string) => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export { setCookie, deleteCookie };
