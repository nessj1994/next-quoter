import React, { useState } from 'react';
// import './input-field.scss';
import { useField, FieldAttributes } from 'formik';

const InputField: React.FC<FieldAttributes<{}>> = ({
  defaultValue,
  placeholder,
  ...props
}) => {
  // const [hasFocus, setHasFocus] = useState(false);
  // const showFeedback =
  //   (!!hasFocus && field.value.trim().length > 2) || touched[field.name];

  const [field, meta] = useField<{}>(props);

  return (
    <>
      <div>
        <input
          type={props.type}
          className={`custom-input ${
            meta.error && meta.touched
              ? 'invalid'
              : meta.touched &&
                field.isRequired &&
                field.value?.trim().length > 2
              ? 'valid'
              : ''
          }`}
          placeholder={placeholder ?? ''}
          {...field}
          {...props}
        />

        <div className="font-semibold text-red-500 feedback">
          <p>
            <small>{meta.error}</small>
          </p>
        </div>
      </div>
    </>
  );
};

export default InputField;
