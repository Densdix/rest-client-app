import { Variable } from '@/store/variablesSlice';

const VARIABLES_KEY = 'restClientVariables';

export const saveVariables = (variables: Variable[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(VARIABLES_KEY, JSON.stringify(variables));
  }
};

export const loadVariables = (): Variable[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(VARIABLES_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse variables from localStorage', e);
      }
    }
  }
  return [];
};

export const replaceVariables = (text: string, variables: Variable[]): string => {
  if (!text || !variables.length) {
    return text;
  }

  let result = text;
  const variablePattern = /\{\{([^}]+)\}\}/g;

  result = result.replace(variablePattern, (match, variableName) => {
    const trimmedName = variableName.trim();
    const variable = variables.find((v) => v.name === trimmedName);

    return variable ? variable.value : match;
  });

  return result;
};

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

export const replaceVariablesInObject = (obj: JsonValue, variables: Variable[]): JsonValue => {
  if (!obj) return obj;

  if (typeof obj === 'string') {
    return replaceVariables(obj, variables);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => replaceVariablesInObject(item, variables));
  }

  if (typeof obj === 'object' && obj !== null) {
    const result: JsonObject = { ...(obj as JsonObject) };
    for (const key in result) {
      result[key] = replaceVariablesInObject(result[key], variables);
    }
    return result;
  }

  return obj;
};
