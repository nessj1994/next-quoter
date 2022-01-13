import React, { useEffect, useState } from 'react';

import { CellProps, HeaderProps, Hooks } from 'react-table';

// Table imports
import QuoteLineTable from '../Tables/Custom/QuoteLineTable';
import {
  EditableCell,
  DeletionCell,
  MarginCell,
  PartCell,
  PricingCell,
} from '../Tables/Cells';

// import usePricing from './pricing-hook';
// import './quote-lines.scss';
import {
  deleteLine,
  fetchLines,
  quoteLinesSelectors,
  removeLine,
} from '../../../store/features/quotes/linesSlice';

import {
  QuoteLine,
  useAppSelector,
  useAppDispatch,
  addNewLine,
  updateLine,
  quoteHeaderSelectors,
  editing,
} from '../../../store';

type ISelectionCellProps = {
  updateMyData: (props: any) => void;
};
type SelectionCellProps = CellProps<any> & ISelectionCellProps;

const selectionHook = (hooks: Hooks<any>) => {
  hooks.allColumns.push((columns) => [
    // Let's make a column for selection
    {
      id: 'Enabled',
      disableResizing: true,
      disableGroupBy: true,
      align: 'center',
      maxWidth: 45,
      hideFooter: false,
      printable: false,
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: () => '',
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Aggregated: () => null,
      Cell: ({
        value: initialValue,
        column: { id, width },
        row: { original, index, values },
        updateMyData,
      }: SelectionCellProps) => {
        const updateEnabled = (e: any) => {
          updateMyData({ original, index, id, value: e.target.checked });
        };
        return (
          <input
            className=""
            type="checkbox"
            defaultChecked={original?.enabled}
            onChange={updateEnabled}
          />
        );
      },
    },
    ...columns,
  ]);
  hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
    // fix the parent group of the selection button to not be resizable
    // const selectionGroupHeader = headerGroups[0].headers[0];
    // selectionGroupHeader.canResize = false;
  });
};

const deletionHook = (hooks: Hooks<any>) => {
  hooks.allColumns.push((columns) => [
    // Let's make a column for selection
    ...columns,
    {
      id: '_deletor',
      disableResizing: true,
      disableGroupBy: true,
      align: 'center',
      width: 45,
      minWidth: 45,
      maxWidth: 45,
      hideFooter: false,
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: () => '',
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox

      Cell: DeletionCell,
    },
  ]);
  hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
    // fix the parent group of the selection button to not be resizable
    // const selectionGroupHeader = headerGroups[0].headers[0];
    // selectionGroupHeader.canResize = false;
  });
};

const QuoteInfoLines = (props: any) => {
  const lines = useAppSelector((state) => quoteLinesSelectors.selectAll(state));
  const header = useAppSelector(editing);
  const dispatch = useAppDispatch();

  const { adminSetting, updateQuoteMultiplier } = props;

  const [adminEnabled, setAdminEnabled] = useState(adminSetting);

  const [showDrop, toggleDrop] = useState(false);

  const [gymSelectOptions, setGymSelectOptions] = useState(['Add New Gym']);

  // useEffect(() => {
  //   let mounted = true;

  //   if (mounted && header) {
  //     dispatch(fetchLines(header.QuoteID));
  //   }

  //   return () => {
  //     mounted = false;
  //   };
  // }, [dispatch]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      setAdminEnabled(adminSetting);
    }

    return () => {
      mounted = false;
    };
  }, [adminSetting]);

  useEffect(() => {
    let mounted = true;

    if (mounted && header) {
      let addedOptions = [];

      for (let i = 1; i <= header.gyms; i++) {
        addedOptions.push(`Edit Gym ${i}`);
      }
      setGymSelectOptions([...gymSelectOptions, ...addedOptions]);
    }
  }, [header]);

  const handleDropDown = () => {
    console.log('click');
    toggleDrop(!showDrop);
  };

  const handleDWLaunch = () => {
    const gymIndex = document.getElementById(
      'input-dw-launch',
    )! as HTMLSelectElement;

    if (gymIndex.selectedIndex.valueOf() === 0) {
      window.location.href = `https://driveworks.litaniasports.com/Integration?User=jness&Run=Gym&PorterJobNo=${
        props.quote?.quote_number
      }&GymNo=${props.quote?.gyms + 1}`;
    } else {
      window.location.href = `https://driveworks.litaniasports.com/Integration?User=jness&Run=Gym&Transition=edit&Specification=${
        props.quote?.quote_number
      }-Gym${gymIndex.selectedIndex.valueOf()}`;
    }
  };

  const addonHooks = [selectionHook, deletionHook];

  const columns = React.useMemo(
    () =>
      [
        {
          Header: 'Gyms',
          hideHeader: true,
          hideFooter: true,
          columns: [
            {
              Header: 'Line',
              accessor: 'line_number',
              width: 64,
              minWidth: 64,
              maxWidth: 64,
              hideFooter: false,
              align: 'left',
              printable: true,
              defaultCanSort: true,
              disableFilters: true,
              isSorted: true,
              Footer: () => {
                return <p>Totals: </p>;
              },
            },
            {
              Header: 'Part',
              accessor: 'part_num',
              Cell: PartCell,
              minWidth: 190,
              maxWidth: 256,
              filter: 'fuzzyText',
              printable: true,
              disableFilters: true,
              hideFooter: false,
              aggregate: () => '',
            },
            {
              Header: 'Weight',
              align: 'left',
              accessor: (row: QuoteLine) => {
                return `${Math.ceil(row.weight)} Lbs`;
              },
              hideFooter: false,
              Footer: (info: any) => {
                const total = info.rows.reduce((sum: number, row: any) => {
                  // console.log(row);
                  return (
                    parseFloat(row.values['Weight']) *
                      Number(row.original.enabled) +
                    sum
                  );
                }, 0);
                return <span>{total.toFixed(2)} LBS</span>;
              },
              maxWidth: 90,
              disableGroupBy: true,
              disableFilters: true,
              printable: true,
              defaultCanSort: false,
              aggregate: () => 'agg',
            },
            {
              Header: 'Qty',
              accessor: 'quantity',
              Cell: EditableCell,
              hideFooter: false,
              width: 48,
              minWidth: 48,
              maxWidth: 48,
              printable: true,
              align: 'left',
              disableFilters: true,
              disableGroupBy: true,
            },
            {
              Header: 'Unit Cost',
              accessor: (row: QuoteLine) => {
                let cost = row.item_cost;

                return cost;
              },
              Cell: (props: CellProps<QuoteLine>): JSX.Element => {
                return (
                  <span>
                    $ {Number(props.row.original?.item_cost).toFixed(2)}
                  </span>
                );
              },
              Footer: (info: any) => {
                const total = info.rows.reduce((sum: number, row: any) => {
                  console.log('bippity boppity');
                  console.log(row.original);
                  return (
                    row.original.item_cost * Number(row.original.enabled) + sum
                  );
                }, 0);
                return <span>${total.toFixed(2)}</span>;
              },
              hideHeader: !adminSetting,
              hideFooter: !adminSetting,
              maxWidth: 112,
              width: 112,
              printable: false,
              align: 'left',
              disableGroupBy: true,
              disableFilters: true,
            },
            {
              id: 'line_multiplier',
              Header: 'Pricing',
              accessor: (row: QuoteLine) => {
                return Number(row.line_multiplier).toFixed(2);
              },
              Cell: PricingCell,
              hideHeader: !adminSetting,
              hideFooter: !adminSetting,
              maxWidth: 90,
              width: 90,
              disableGroupBy: true,
              disableFilters: true,
              printable: false,
              align: 'center',
            },
            {
              id: 'margin',
              Header: 'Margin',
              Cell: MarginCell,
              width: 128,
              minWidth: 128,
              maxWidth: 128,
              printable: false,
              Footer: (info: any) => {
                const totalPrice = info.rows.reduce((sum: number, row: any) => {
                  // console.log(row);
                  return (
                    parseFloat(row.values['Line Total']) *
                      header.quote_multiplier +
                    sum
                  );
                }, 0);

                const totalCost = info.rows.reduce((sum: number, row: any) => {
                  // console.log(row);
                  return (
                    parseFloat(row.values['Unit Cost']) *
                      row.original.quantity +
                    sum
                  );
                }, 0);
                const totalProfit = totalPrice - totalCost;

                const totalMargin = totalProfit / totalPrice;
                return <span>{totalMargin.toFixed(2)}</span>;
              },
              hideHeader: !adminSetting,
              hideFooter: !adminSetting,
              align: 'center',
              disableGroupBy: true,
              disableFilters: true,
            },
            {
              Header: 'Price',
              accessor: (row: QuoteLine) => {
                if (row.configured) {
                  return Number(
                    row.unit_price! *
                      props.quoteMultiplier *
                      Number(row.enabled),
                  ).toFixed(2);
                }
                return Number(
                  row.unit_price! *
                    row.line_multiplier *
                    props.quoteMultiplier *
                    Number(row.enabled),
                ).toFixed(2);
              },
              Cell: (props: CellProps<QuoteLine>): JSX.Element => {
                return <span>$ {props.row.values['Price']}</span>;
              },
              width: 90,
              minWidth: 90,
              maxWidth: 90,
              hideFooter: false,
              align: 'left',
              printable: true,
              disableGroupBy: true,
              disableFilters: true,
            },

            {
              Header: 'Line Total',
              accessor: (row: QuoteLine) => {
                if (row.configured) {
                  return Number(row.line_total * Number(row.enabled)).toFixed(
                    2,
                  );
                } else {
                  return Number(
                    row.unit_price *
                      row.quantity *
                      row.line_multiplier *
                      props.quoteMultiplier *
                      Number(row.enabled),
                  ).toFixed(2);
                }
              },
              Cell: (props: CellProps<QuoteLine>): JSX.Element => {
                return <span>$ {props.row.values['Line Total']}</span>;
              },
              Footer: (info: any) => {
                const total = info.rows.reduce((sum: number, row: any) => {
                  // console.log(row);
                  return parseFloat(row.values['Line Total']) + sum;
                }, 0);
                return <span>${total.toFixed(2)}</span>;
              },
              width: 164,
              minWidth: 128,
              maxWidth: 164,
              align: 'left',
              hideFooter: false,
              disableGroupBy: true,
              disableFilters: true,
            },
          ],
        },
      ].flatMap((c: any) => c.columns), // remove comment to drop header groups
    [adminEnabled, props.quoteMultiplier],
  );

  const data = React.useMemo(() => lines, [lines, header]);

  const handleAddLine = (e: any) => {
    const lineitem = document.getElementById(
      'input-add-line',
    )! as HTMLInputElement;

    if (lineitem.value) {
      // console.log(lineitem.value);
      // ! PATCH ME: Add case for QuoteID is null
      dispatch(
        addNewLine({
          quoteID: props.quote.quote_id,
          partNum: lineitem.value.toString(),
          nextLine: lines.length + 1,
        }),
      );

      // dispatch(addToPrice())

      lineitem.value = '';
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full z-[10] ">
      <div className="flex flex-row justify-between p-3 border rounded-md print:hidden">
        <div className="col">
          <div className="form-group">
            <label
              className="font-semibold form-label"
              hidden={!adminEnabled}
              htmlFor="input_quote_multiplier"
            >
              Quote Multiplier
            </label>
            <div className="rounded-sm input-group new-item">
              <input
                className="border border-blue-500 form-control"
                hidden={!adminEnabled}
                type="number"
                step={0.05}
                defaultValue={1}
                id="input_quote_multiplier"
                onChange={(e) => {
                  updateQuoteMultiplier(Number(e.target.value));
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="form-group ">
            <label className="font-semibold " htmlFor="input-add-line">
              Add A Line
            </label>

            <div className="border border-blue-500 rounded-sm input-group new-item">
              <input
                type="text"
                className="form-control form-control-sm "
                id="input-add-line"
                placeholder="Part Num"
                onKeyPress={(e) => e.key === 'Enter' && handleAddLine(e)}
              />
              <button
                className="px-1 bg-blue-500 border-l-2 rounded-sm input-group-text btn-primary"
                type="button"
                onClick={handleAddLine}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label className="font-semibold " htmlFor="input-dw-launch">
              Configure Gyms
            </label>

            <div className="border border-blue-500 rounded-lg input-group new-item">
              <select
                className="pl-3 rounded-lg "
                aria-label="Default select example"
                id="input-dw-launch"
              >
                {gymSelectOptions.map((value, index) => {
                  return (
                    <option value={index} key={index}>
                      {value}
                    </option>
                  );
                })}
              </select>
              <button
                className="px-1 input-group-text btn-primary"
                type="button"
                onClick={(e) => {
                  e.preventDefault();

                  handleDWLaunch();
                }}
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-col flex-1 h-full rounded-md ">
        <QuoteLineTable<QuoteLine>
          name="quote-line-table"
          columns={columns}
          data={data}
          updateMyData={(updatedInfo) => {
            const { original, index, id, value } = updatedInfo;
            const temp = { ...original };
            temp[`${id}`] = value;
            dispatch(updateLine(temp));
            return true;
          }}
          addonHooks={addonHooks}
          // defaultCanSort={true}
          // sortOptions={{ id: 'LineNumber', desc: false }}
        />
      </div>
    </div>
  );
};

QuoteInfoLines.displayName = 'QuoteInfoLines';
export default QuoteInfoLines;
