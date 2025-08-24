import { useState, useCallback } from 'react';
import { validateInput, INPUT_LIMITS } from '@/lib/validation';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationState {
  errors: ValidationError[];
  isValid: boolean;
  touched: Set<string>;
}

export const useValidation = () => {
  const [validationState, setValidationState] = useState<ValidationState>({
    errors: [],
    isValid: true,
    touched: new Set()
  });

  const validateField = useCallback((
    field: string,
    value: string,
    type: keyof typeof INPUT_LIMITS,
    options?: { required?: boolean; customValidation?: (input: string) => { isValid: boolean; error?: string } }
  ) => {
    const validation = validateInput(value, type, options);
    
    if (!validation.isValid) {
      return {
        isValid: false,
        error: validation.error || `Invalid ${field}`
      };
    }
    
    return { isValid: true, error: undefined };
  }, []);

  const validateFormField = useCallback((
    field: string,
    value: string,
    type: keyof typeof INPUT_LIMITS,
    options?: { required?: boolean; customValidation?: (input: string) => { isValid: boolean; error?: string } }
  ) => {
    const validation = validateField(field, value, type, options);
    
    setValidationState(prev => {
      const newErrors = prev.errors.filter(error => error.field !== field);
      
      if (!validation.isValid) {
        newErrors.push({
          field,
          message: validation.error || `Invalid ${field}`
        });
      }
      
      return {
        ...prev,
        errors: newErrors,
        isValid: newErrors.length === 0,
        touched: new Set([...prev.touched, field])
      };
    });
    
    return validation;
  }, [validateField]);

  const clearFieldError = useCallback((field: string) => {
    setValidationState(prev => ({
      ...prev,
      errors: prev.errors.filter(error => error.field !== field)
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setValidationState(prev => ({
      ...prev,
      errors: [],
      isValid: true
    }));
  }, []);

  const markFieldAsTouched = useCallback((field: string) => {
    setValidationState(prev => ({
      ...prev,
      touched: new Set([...prev.touched, field])
    }));
  }, []);

  const getFieldError = useCallback((field: string) => {
    return validationState.errors.find(error => error.field === field)?.message;
  }, [validationState.errors]);

  const isFieldTouched = useCallback((field: string) => {
    return validationState.touched.has(field);
  }, [validationState.touched]);

  return {
    validationState,
    validateField,
    validateFormField,
    clearFieldError,
    clearAllErrors,
    markFieldAsTouched,
    getFieldError,
    isFieldTouched
  };
};
