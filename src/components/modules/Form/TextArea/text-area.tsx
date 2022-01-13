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
        cols={50}
        rows={3}
        maxLength={500}
        className={`custom-input ${meta.error ? 'invalid' : 'valid'}`}
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
