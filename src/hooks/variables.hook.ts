import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Variable, addVariable, removeVariable, setVariables, updateVariable } from '@/store/variablesSlice';
import { RootState } from '@/store';
import { loadVariables, saveVariables } from '@/utils/localstorage/variables';

export const useVariables = () => {
  const dispatch = useDispatch();
  const variables = useSelector((state: RootState) => state.variables.items);
  const isLoaded = useSelector((state: RootState) => state.variables.isLoaded);

  useEffect(() => {
    if (!isLoaded) {
      const loadedVariables = loadVariables();
      dispatch(setVariables(loadedVariables));
    }
  }, [dispatch, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveVariables(variables);
    }
  }, [variables, isLoaded]);

  const createVariable = useCallback(
    (name: string, value: string) => {
      const newVariable: Variable = {
        id: uuidv4(),
        name,
        value,
      };
      dispatch(addVariable(newVariable));
      return newVariable;
    },
    [dispatch]
  );

  const updateVariableById = useCallback(
    (id: string, name: string, value: string) => {
      const updatedVariable: Variable = {
        id,
        name,
        value,
      };
      dispatch(updateVariable(updatedVariable));
      return updatedVariable;
    },
    [dispatch]
  );

  const deleteVariable = useCallback(
    (id: string) => {
      dispatch(removeVariable(id));
    },
    [dispatch]
  );

  return {
    variables,
    isLoaded,
    createVariable,
    updateVariableById,
    deleteVariable,
  };
};
