import { URL } from 'url';
import constants from '../utils/constants';

interface ReceivedFields {
  [key: string]: string;
}
export const validateFields = (receivedFields: ReceivedFields) => {
  const errorsEmptyFields = Object.keys(receivedFields).map((field) => {
    const fieldValue = receivedFields[field];
    if (field === constants.SIMPLE_STRING_FIELD) {
      return checkIfStringValid(field, fieldValue);
    }

    return null;
  });

  const message = errorsEmptyFields.join('*');
  if (message === '') {
    return undefined;
  }
  return message;
};

function checkIfStringValid(field: string, fieldValue: string) {
  const messages: string[] = [];
  if (fieldValue === null || fieldValue === undefined) {
    messages.push(`The ${field} is missing!`);
    return compoundMessages(messages);
  }
  if (field === constants.SIMPLE_STRING_FIELD)
    field = constants.ITEM_CONTENT_USER_DISPLAY;
  if (typeof fieldValue !== 'string') {
    messages.push(`The ${field} is not valid!`);
    return compoundMessages(messages);
  }
  if (fieldValue.length > constants.MAX_LENGTH) {
    messages.push(`The ${field} is too long! - ${fieldValue.length} ch`);
  }
  if (fieldValue.length < constants.MIN_LENGTH) {
    messages.push(`The ${field} is too short! - ${fieldValue.length} ch`);
  }
  if (/<\/?[a-z][\s\S]*>/i.test(fieldValue)) {
    messages.push(`The ${field} is dangerous! Marked as HTML.`);
  }
  if (stringIsAValidUrl(fieldValue)) {
    messages.push(`The ${field} is dangerous! Marked as URL.`);
  }

  if (checkIfStringIsProgrammingLanguage(fieldValue)) {
    messages.push(`The ${field} is dangerous! Marked as programming language.`);
  }

  return compoundMessages(messages);
}

function checkIfStringIsProgrammingLanguage(inputString: string) {
  const containsCode = constants.PROGRAMMING_LANGUAGE_CODE.some((element) => {
    if (inputString.toLowerCase().includes(element.toLowerCase())) return true;
    return false;
  });
  return containsCode;
}

function stringIsAValidUrl(s: string) {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
}

function compoundMessages(messages: string[]) {
  const raceIDErrorMessages = messages.join('*');
  if (raceIDErrorMessages === '') {
    return undefined;
  }
  return raceIDErrorMessages;
}
