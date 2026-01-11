export const CHARACTER_REGEX = /^[a-zA-Z ]+$/
export const EMAIL_REGEX =
  /^(?=[a-zA-Z0-9][a-zA-Z0-9._+-]{0,63}@)[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/
export const PHONE_NUMBER_REGEX = /^\+[1-9]\d{8,14}$/
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[{\]};:'",<.>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=[{\]};:'",<.>/?\\|`~]{8,20}$/
