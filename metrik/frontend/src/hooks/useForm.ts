import { useState, useCallback } from 'react';

export type ValidationRule<T> = (value: T) => string | undefined;

export interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
}

export interface FormState<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
}

export function useForm<T extends Record<string, any>>(initialValues: T, validationRules?: Partial<Record<keyof T, ValidationRule<any>[]>>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isValid: true,
  });

  const validateField = useCallback((name: keyof T, value: any) => {
    if (!validationRules?.[name]) return undefined;

    for (const rule of validationRules[name]!) {
      const error = rule(value);
      if (error) return error;
    }

    return undefined;
  }, [validationRules]);

  const validateForm = useCallback(() => {
    const errors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(state.values).forEach((key) => {
      const name = key as keyof T;
      const error = validateField(name, state.values[name]);
      if (error) {
        errors[name] = error;
        isValid = false;
      }
    });

    setState(prev => ({
      ...prev,
      errors,
      isValid,
    }));

    return isValid;
  }, [state.values, validateField]);

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value,
      },
      errors: {
        ...prev.errors,
        [name]: validateField(name, value),
      },
    }));
  }, [validateField]);

  const setFieldTouched = useCallback((name: keyof T) => {
    setState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }));
  }, []);

  const handleChange = useCallback((name: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, event.target.value);
  }, [setFieldValue]);

  const handleBlur = useCallback((name: keyof T) => () => {
    setFieldTouched(name);
  }, [setFieldTouched]);

  const resetForm = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isValid: true,
    });
  }, [initialValues]);

  const submitForm = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
    const isValid = validateForm();
    if (!isValid) return;

    try {
      await onSubmit(state.values);
      resetForm();
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  }, [state.values, validateForm, resetForm]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isValid: state.isValid,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    resetForm,
    submitForm,
  };
} 