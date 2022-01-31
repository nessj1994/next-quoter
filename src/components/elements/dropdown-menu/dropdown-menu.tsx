import React, { useState, useEffect } from 'react';
// import './dropdown-menu.scss';

interface IDropdownProps {
  items?: Array<DropdownItem>;
  children?: any;
}

type DropdownItem = {
  itemLabel: string;
  component: React.ElementType;
  linkPath?: string | undefined;
  onClick?: () => any | undefined;
};

type DropdownProps = IDropdownProps & any;

const Dropdown = (props: DropdownProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let mounted = true;

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      className="relative inline-block text-left "
      onBlur={() => setVisible(false)}
    >
      <button
        className="rounded-sm "
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown-menu"
        aria-haspopup="true"
        aria-expanded="false"
        onClick={() => setVisible(!visible)}
      >
        {props.children}
      </button>
      <ul
        className={` origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${
          visible ? 'visible' : 'hidden'
        } z-50`}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        {props.items.map((item: DropdownItem) => {
          const Component = item.component;
          return (
            <li className="hover:ring-1 ">
              {/* <a className="dropdown-item" href={item.linkPath}>
          {item.itemLabel}
        </a> */}
              <Component
                className="text-gray-700 block px-4 py-2 text-sm "
                href={item.linkPath}
                onClick={(e) => {
                  e.preventDefault();
                  item.onClick();
                }}
              >
                {item.itemLabel}
              </Component>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Dropdown;

// {/* <ul
//   className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black  ${
//     visible && 'show'
//   }`}
//   role="menu"
//   onMouseDown={(e) => {
//     e.preventDefault();
//   }}
// >

//     );
//   })}
// </ul> */}
