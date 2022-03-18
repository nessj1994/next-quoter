import React from 'react';

type AdminSwitchProps = {
  adminEnabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & any;

const AdminSwitch = (props: AdminSwitchProps) => {
  const { adminEnabled, onChange } = props;
  console.log(adminEnabled);
  return (
    <>
      {/* <div className="form-check form-switch">
        <label
          className="form-check-label col d-none d-lg-inline text-nowrap"
          htmlFor="flexSwitchCheckDefault"
        ></label>
        <input
          className=" col form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault"
          role="switch"
          onChange={onChange}
        />
      </div> */}
      <label className=" flex items-center justify-between p-2 group z-10">
        <input
          type="checkbox"
          className="absolute z-10 rounded-md appearance-none -translate-x-1/4 left-1/2 peer"
          defaultChecked={adminEnabled}
          onChange={onChange}
        />
        <span className="flex items-center flex-shrink-0 w-6 h-3 p-1 ml-4 duration-300 ease-in-out bg-gray-300 rounded-full peer-checked:bg-porter-accent after:w-2 after:h-2 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-2 group-hover:after:translate-x-1/4"></span>
      </label>
    </>
  );
};

export default AdminSwitch;
