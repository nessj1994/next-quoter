import React, { useState } from 'react';
import { useField, FieldAttributes } from 'formik';

const SelectField: React.FC<FieldAttributes<{}>> = ({
  defaultValue,
  placeholder,
  ...props
}) => {
  // const [hasFocus, setHasFocus] = useState(false);
  // const showFeedback =
  //   (!!hasFocus && field.value.trim().length > 2) || touched[field.name];

  const [field, meta] = useField<{}>(props);

  return (
    <div>
      <select
        className={`custom-input bg-gray-100 rounded-sm ${
          meta.error ? 'invalid' : 'valid'
        }`}
        {...field}
        {...props}
        value={String(field.value)}
      >
        {props.children}
      </select>
      <div className="feedback invalid">
        <p>
          <small>{meta.error}</small>
        </p>
      </div>
    </div>
  );
};

export default SelectField;
