import React, { useState } from 'react';

const MultiSelect = (props: { options: Array<any>; label: string }) => {
  const [selected, setSelected] = useState([]);

  return (
    <div className="relative">
      <div className="c-multi-select-dropdown__selected">
        <div>
          0 Selected
          <span>^</span>
        </div>
      </div>
      <ul className="absolute">
        <li>
          <input type="checkbox" className={`bg-blue-300`} key={`all-value`} />
          <span>Select All</span>
        </li>
        {props.options.map((option) => (
          <li key={`option-${option.username}`}>
            <input
              type="checkbox"
              className={`bg-blue-300`}
              key={`${option.username}-value`}
            />
            <span>{option.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MultiSelect;
