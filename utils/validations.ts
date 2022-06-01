/**
 * Method for validating emails
 * @param email a string to be validated as an email
 * @returns true if passed string is a valid email
 */
export const isValidEmail = (email: string): boolean => {
  const match = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  return !!match;
};

/**
 * Method for validating emails
 * @param email a string to be validated as an email
 * @returns undefined if passed string is a valid email
 * @returns a string if passed string is a not valid email
 */
export const isEmail = (email: string): string | undefined => {
  return isValidEmail(email) ? undefined : "El correo no parece ser válido";
};
