import React, { useState } from 'react';
import moment from 'moment';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { useField, FieldAttributes, useFormikContext } from 'formik';

const DateField: React.FC<FieldAttributes<{}>> = ({ ...props }) => {
  // const [hasFocus, setHasFocus] = useState(false);
  // const showFeedback =
  //   (!!hasFocus && field.value.trim().length > 2) || touched[field.name];

  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField<{}>(props);

  const handleChange = (val) => {
    console.log('handling change....');

    setFieldValue(field.name, val);
  };

  return (
    <div>
      <DatePicker
        name={field.name}
        className={`form-control form-control-sm bg-gray-100 shadow-sm ${
          meta.error ? 'invalid' : 'valid'
        }`}
        dateFormat="MM-dd-yyyy"
        autoComplete="off"
        nextMonthButtonLabel=">"
        previousMonthButtonLabel="<"
        selected={field.value ? new Date(field.value) : ''}
        onChange={handleChange}
        disabled={props.disabled}
      />

      <div className="text-red-500 feedback">
        <p>
          <small>{meta.error}</small>
        </p>
      </div>
    </div>
  );
};

export default DateField;
