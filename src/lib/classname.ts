type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined;
type ClassDictionary = Record<string, unknown>;
type ClassArray = ClassValue[];

function toVal(mix: ClassValue): string {
  let str = "";

  if (typeof mix === "string" || typeof mix === "number") {
    str += mix;
  } else if (mix && typeof mix === "object") {
    if (Array.isArray(mix)) {
      for (const value of mix) {
        const className = toVal(value);

        if (className) {
          if (str) str += " ";
          str += className;
        }
      }
    } else {
      for (const key in mix) {
        if (mix[key]) {
          if (str) str += " ";
          str += key;
        }
      }
    }
  }

  return str;
}

export function cn(...args: ClassValue[]) {
  let str = "";

  for (const value of args) {
    const className = toVal(value);

    if (className) {
      if (str) str += " ";
      str += className;
    }
  }

  return str;
}
