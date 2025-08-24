"use client";

import React, { forwardRef, useState, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';
import { validateInput, INPUT_LIMITS } from '@/lib/validation';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export interface SecureInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  type: keyof typeof INPUT_LIMITS;
  required?: boolean;
  showValidation?: boolean;
  onChange?: (value: string, isValid: boolean) => void;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  className?: string;
  containerClassName?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export const SecureInput = forwardRef<HTMLInputElement, SecureInputProps>(
  ({ 
    label, 
    type, 
    required = false, 
    showValidation = true,
    onChange,
    onValidationChange,
    className,
    containerClassName,
    error: externalError,
    showPasswordToggle = false,
    ...props 
  }, ref) => {
    const [value, setValue] = useState(props.defaultValue?.toString() || props.value?.toString() || '');
    const [isValid, setIsValid] = useState(true);
    const [validationError, setValidationError] = useState<string>();
    const [showPassword, setShowPassword] = useState(false);
    const [isTouched, setIsTouched] = useState(false);

    const inputType = showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : props.type;

    const validateField = useCallback((inputValue: string) => {
      const validation = validateInput(inputValue, type, { required });
      setIsValid(validation.isValid);
      setValidationError(validation.error);
      
      if (onValidationChange) {
        onValidationChange(validation.isValid, validation.error);
      }
      
      return validation;
    }, [type, required, onValidationChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      
      if (isTouched) {
        validateField(newValue);
      }
      
      if (onChange) {
        const validation = validateField(newValue);
        onChange(newValue, validation.isValid);
      }
    };

    const handleBlur = () => {
      setIsTouched(true);
      validateField(value);
    };

    const handleFocus = () => {
      if (validationError) {
        setValidationError(undefined);
      }
    };

    // Validate on mount if required
    useEffect(() => {
      if (required && value) {
        validateField(value);
      }
    }, [required, value, validateField]);

    // Show external error if provided
    const displayError = externalError || validationError;
    const showError = showValidation && isTouched && displayError;
    const showSuccess = showValidation && isTouched && !displayError && value && isValid;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label htmlFor={props.id} className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        
        <div className="relative">
          <Input
            ref={ref}
            {...props}
            type={inputType}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={cn(
              "pr-10", // Make room for icons
              showError && "border-red-500 focus:border-red-500 focus:ring-red-500",
              showSuccess && "border-green-500 focus:border-green-500 focus:ring-green-500",
              className
            )}
          />
          
          {/* Password toggle */}
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          
          {/* Validation icons */}
          {showValidation && isTouched && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {showError && <AlertCircle className="h-4 w-4 text-red-500" />}
              {showSuccess && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
          )}
        </div>
        
        {/* Error message */}
        {showError && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {displayError}
          </p>
        )}
        
        {/* Character count */}
        {showValidation && (
          <div className="flex justify-between text-xs text-gray-500">
            <span>{value.length} characters</span>
            <span>
              {INPUT_LIMITS[type].min}-{INPUT_LIMITS[type].max} characters
            </span>
          </div>
        )}
      </div>
    );
  }
);

SecureInput.displayName = "SecureInput";
