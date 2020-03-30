import { useContext, useCallback, useEffect } from 'react';
import FormContext from '../Form/Context';

import './index.scss';

const useFieldType = (options) => {
  const {
    name,
    required,
    defaultValue,
    onChange,
    validate,
  } = options;

  const formContext = useContext(FormContext);
  const { dispatchFields, submitted, processing } = formContext;
  const mountValue = formContext.fields[name]?.value || null;

  const sendField = useCallback((valueToSend) => {
    dispatchFields({
      name,
      value: valueToSend,
      valid: required && validate
        ? validate(valueToSend || '')
        : true,
    });
  }, [name, required, dispatchFields, validate]);

  useEffect(() => {
    sendField(mountValue);
  }, [sendField, mountValue]);

  useEffect(() => {
    if (defaultValue != null) sendField(defaultValue);
  }, [defaultValue, sendField]);

  const valid = formContext.fields[name] ? formContext.fields[name].valid : true;
  const showError = valid === false && formContext.submitted;

  const valueToRender = formContext.fields[name] ? formContext.fields[name].value : '';

  return {
    ...options,
    showError,
    sendField,
    value: valueToRender,
    formSubmitted: submitted,
    formProcessing: processing,
    onFieldChange: (e) => {
      if (e && e.target) {
        sendField(e.target.value);
      } else {
        sendField(e);
      }

      if (onChange && typeof onChange === 'function') onChange(e);
    },
  };
};

export default useFieldType;