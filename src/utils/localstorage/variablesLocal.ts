export interface Variable {
  id: string;
  name: string;
  value: string;
}

const VARIABLES_KEY = 'restClientVariables';

export const saveVariablesToStorage = (variables: Variable[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(VARIABLES_KEY, JSON.stringify(variables));
  }
};

export const getVariablesFromStorage = (): Variable[] => {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem(VARIABLES_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse variables from localStorage', e);
    }
  }
  return [];
};

export const addVariable = (name: string, value: string): Variable => {
  const variables = getVariablesFromStorage();
  const newVariable: Variable = {
    id: crypto.randomUUID(),
    name,
    value,
  };

  variables.push(newVariable);
  saveVariablesToStorage(variables);
  return newVariable;
};

export const updateVariable = (id: string, name: string, value: string): Variable | null => {
  const variables = getVariablesFromStorage();
  const index = variables.findIndex((v) => v.id === id);

  if (index !== -1) {
    const updatedVariable: Variable = {
      id,
      name,
      value,
    };
    variables[index] = updatedVariable;
    saveVariablesToStorage(variables);
    return updatedVariable;
  }

  return null;
};

export const deleteVariable = (id: string): void => {
  const variables = getVariablesFromStorage();
  const updatedVariables = variables.filter((v) => v.id !== id);
  saveVariablesToStorage(updatedVariables);
};

export const replaceVariables = (text: string): string => {
  const variables = getVariablesFromStorage();

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

export const replaceVariablesInObject = <T>(obj: T): T => {
  if (!obj) return obj;

  if (typeof obj === 'string') {
    return replaceVariables(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => replaceVariablesInObject(item)) as unknown as T;
  }

  if (typeof obj === 'object' && obj !== null) {
    const result = { ...obj };
    for (const key in result) {
      result[key] = replaceVariablesInObject(result[key]);
    }
    return result;
  }

  return obj;
};
