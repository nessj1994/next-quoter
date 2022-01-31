import React from 'react';
import { useAppDispatch, addComponent } from '../../../../store';
// import './ComponentTableToolbar.scss';

const ComponentTableToolbar = (props: { lineID: number }) => {
  const compTypes = ['M', 'N', 'R', 'X'];

  const dispatch = useAppDispatch();

  const handleAddComponent = (e: any) => {
    const lineitem = document.getElementById(
      'input-component-part',
    )! as HTMLInputElement;

    if (lineitem.value) {
      console.log(lineitem.value);
      console.log(props.lineID);
      dispatch(
        addComponent({
          lineID: props.lineID,
          partNum: lineitem.value.toString(),
          qty: 1,
          type: 'N',
        }),
      );
      lineitem.value = '';
    }
  };

  return (
    <>
      <strong>
        <p> Add Component </p>
      </strong>
      <div className="container">
        <div className="flex flex-row gap-1">
          <div className="col">
            <div className="form-group">
              <label className="form-label " htmlFor="input-add-component">
                Seq
              </label>

              <input
                type="text"
                className="custom-input "
                id="input-component-sequence"
                defaultValue="999"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComponent(e)}
              />
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <label className="form-label " htmlFor="input-add-component">
                Part
              </label>

              <div className="input-group new-item">
                <input
                  type="text"
                  className="custom-input "
                  id="input-component-part"
                  placeholder="Part Num"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComponent(e)}
                />
              </div>
            </div>
          </div>

          {/* If we need the type field later this should be commented back in */}
          {/* <div className="col">
            <div className="form-group">
              <label className="form-label " htmlFor="input-add-component">
                Type
              </label>

              <div className="input-group new-item">
                <select
                  className="form-control form-control-sm "
                  id="input-comp-type"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComponent(e)}
                >
                  {compTypes.map((type, i) => (
                    <option key={`comptype_${i}`} value={i}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div> */}

          <div className="col">
            <div className="form-group">
              <label className="form-label " htmlFor="input-add-component">
                Qty
              </label>
              <div className="input-group new-item">
                <input
                  type="number"
                  step={1}
                  className="custom-input"
                  id="input-comp-qty"
                  placeholder="Qty"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComponent(e)}
                />
              </div>
            </div>
          </div>

          <div className="col">
            <button
              type="button"
              className="p-2 bg-white text-porter hover:bg-porter hover:text-white rounded-xl border border-porter"
              onClick={handleAddComponent}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComponentTableToolbar;
