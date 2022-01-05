import React, { useState } from 'react';
import { useField, FieldAttributes, useFormikContext } from 'formik';

const TextArea: React.FC<FieldAttributes<{}>> = ({
  defaultValue,
  placeholder,
  ...props
}) => {
  // const [hasFocus, setHasFocus] = useState(false);
  // const showFeedback =
  //   (!!hasFocus && field.value.trim().length > 2) || touched[field.name];

  const [field, meta, form] = useField<{}>(props);

  const date = new Date(field.value);
  return (
    <div>
      <textarea
        {...field}
        {...props}
        rows={3}
        className={`form-control form-control-sm bg-gray-100 shadow-md ${
          meta.error ? 'invalid' : 'valid'
        }`}
      />

      <div className="feedback invalid">
        <p>
          <small>{meta.error}</small>
        </p>
      </div>
    </div>
  );
};

export default TextArea;
