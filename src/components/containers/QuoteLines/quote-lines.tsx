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
  QuoteHeader,
} from '../../../store';
import { useSession } from 'next-auth/react';

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
          updateMyData({
            original,
            index,
            field: 'enabled',
            value: e.target.checked,
          });
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
  const initExpired = (header: Partial<QuoteHeader>) => {
    let value = header.expire_date
      ? new Date(header.expire_date).getTime() < new Date().getTime()
      : false;

    console.log('Expired: ', value);
    return value;
  };

  const lines = useAppSelector((state) => quoteLinesSelectors.selectAll(state));
  const header = useAppSelector(editing);
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [headerExpired, setHeaderExpired] = useState(initExpired(header));

  const { adminSetting, updateQuoteMultiplier } = props;
  const [adminEnabled, setAdminEnabled] = useState(adminSetting);

  const [showDrop, toggleDrop] = useState(false);

  const [gymSelectOptions, setGymSelectOptions] = useState(['Add New Gym']);

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

      setHeaderExpired(initExpired(header));

      for (let i = 1; i <= header?.gyms; i++) {
        addedOptions.push(`Edit Gym ${i}`);
      }
      setGymSelectOptions([...gymSelectOptions, ...addedOptions]);
    }
  }, [header]);

  const handleDWLaunch = () => {
    const gymIndex = document.getElementById(
      'input-dw-launch',
    )! as HTMLSelectElement;

    const custID = session.user?.customer_id;
    const username = session.user?.username;

    const loginID = custID === '800221' ? username : custID;

    console.log('Launching driveworks with user: ', session.user.username);
    // ! Check if selected quote has quotenumber first then launch. Should be the save for adding lines. Otherwise throw error.
    if (header?.quote_number) {
      if (gymIndex.selectedIndex.valueOf() === 0) {
        window.location.href = `https://driveworks.litaniasports.com/Integration?User=${custID}&Run=Gym&PorterJobNo=${
          props.quote?.quote_number
        }&GymNo=${props.quote?.gyms + 1}`;
      } else {
        window.location.href = `https://driveworks.litaniasports.com/Integration?User=${custID}&Run=Gym&Transition=edit&Specification=${
          props.quote?.quote_number
        }-Gym${gymIndex.selectedIndex.valueOf()}`;
      }
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
              Cell: ({ row }: CellProps<QuoteLine>): JSX.Element => {
                return (
                  <span
                    className={`${!row.original.enabled ? 'line-through' : ''}`}
                  >
                    {row.values['Weight']}
                  </span>
                );
              },
              Footer: (info: any) => {
                const total = info.rows.reduce((sum: number, row: any) => {
                  // console.log(row);
                  return (
                    parseFloat(row.values['Weight']) *
                      row.original.quantity *
                      Number(row.original.enabled) +
                    sum
                  );
                }, 0);
                return <span>{total.toFixed(2)} LBS</span>;
              },
              hideFooter: false,
              maxWidth: 90,
              disableGroupBy: true,
              disableFilters: true,
              printable: true,
              defaultCanSort: false,
              aggregate: () => 'agg',
            },
            {
              Header: 'Qty',
              id: 'quantity',
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
                  return (
                    row.original.item_cost *
                      row.original.quantity *
                      Number(row.original.enabled) +
                    sum
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
              id: 'pricing_mode',
              Header: 'Pricing',
              accessor: 'pricing_mode',
              Cell: PricingCell,
              hideHeader: !adminSetting,
              hideFooter: !adminSetting,
              maxWidth: 150,
              width: 150,
              minWidth: 150,
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
                    parseFloat(row.original.line_total) *
                      Number(row.original.enabled) *
                      header.quote_multiplier +
                    sum
                  );
                }, 0);

                const totalCost = info.rows.reduce((sum: number, row: any) => {
                  // console.log(row);
                  return (
                    parseFloat(row.values['Unit Cost']) *
                      Number(row.original.enabled) *
                      row.original.quantity +
                    sum
                  );
                }, 0);
                const totalProfit = totalPrice - totalCost;

                let totalMargin = totalProfit / totalPrice;
                if (!totalMargin) {
                  totalMargin = 0;
                }
                return <span>% {Number(totalMargin * 100).toFixed(2)}</span>;
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
                if (headerExpired) {
                  return '';
                }

                if (row.configured) {
                  return Number(row.unit_price!).toLocaleString('en-us', {
                    style: 'currency',
                    currency: 'usd',
                  });
                }
                return Number(row.unit_price! * props.quoteMultiplier).toFixed(
                  2,
                );
              },
              Cell: ({ row }: CellProps<QuoteLine>): JSX.Element => {
                return (
                  <span
                    className={`${!row.original.enabled ? 'line-through' : ''}`}
                  >
                    {row.values['Price']}
                  </span>
                );
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
                if (headerExpired) {
                  return '';
                }

                return Number(row.line_total).toLocaleString('en-us', {
                  style: 'currency',
                  currency: 'usd',
                });
              },
              Cell: ({ row }: CellProps<QuoteLine>): JSX.Element => {
                return (
                  <span
                    className={`${!row.original.enabled ? 'line-through' : ''}`}
                  >
                    {row.values['Line Total']}
                  </span>
                );
              },
              Footer: (info: any) => {
                if (headerExpired) {
                  return 'Quote expired \n Please reprice for a new total';
                }

                const confTotal = info.rows.reduce((sum: number, row: any) => {
                  // console.log(row);
                  return (
                    row.original.line_total *
                      row.original.enabled *
                      Number(row.original.configured) +
                    sum
                  );
                }, 0);

                const stockTotal = info.rows.reduce((sum: number, row: any) => {
                  // console.log(row);
                  return (
                    row.original.line_total *
                      row.original.enabled *
                      Number(!row.original.configured) +
                    sum
                  );
                }, 0);

                const total = stockTotal + confTotal;

                // Grab the quote date
                let quote_date = new Date(header?.quote_date);
                // Grab the ship date
                let ship_date = new Date(header?.ship_date);

                // Set current accepted difference before escalation
                let escAfter = new Date(quote_date);
                let escValue = 0;
                let escPercent = 0;
                let summedVal = total;

                console.log('Init ESC Date to: ', escAfter);
                escAfter.setMonth(escAfter.getMonth() + 1);
                console.log('Updated ESC Date to: ', escAfter);
                console.log(ship_date.getMonth());
                if (escAfter < ship_date) {
                  console.log('Should Escalate');
                  // let monthsPastEsc = 1;
                  // while (monthsPastEsc + 1 < ship_date.getMonth()) {
                  //   monthsPastEsc++;
                  // }
                  var months;
                  months =
                    (ship_date.getFullYear() - escAfter.getFullYear()) * 12;
                  months -= escAfter.getMonth();
                  months += ship_date.getMonth();
                  months = months <= 0 ? 0 : months;

                  escPercent = 1.5 * months;
                  // ! ADD if statement to check if configured lines exist
                  // ! if so then apply ESC to all lines
                  escValue = (confTotal * escPercent) / 100;
                  summedVal += escValue;
                }

                return (
                  <>
                    <div className="flex flex-col items-start">
                      <span>Subtotal: ${total.toFixed(2)}</span>
                      <span>Escalation: ${escValue.toFixed(2)}</span>
                      <span>Total: $ {summedVal.toFixed(2)}</span>
                    </div>
                  </>
                );
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
    [adminEnabled, props.quoteMultiplier, header?.ship_date, headerExpired],
  );

  const data = React.useMemo(() => lines, [lines, header]);

  const handleAddLine = (e: any) => {
    const lineitem = document.getElementById(
      'input-add-line',
    )! as HTMLInputElement;

    if (lineitem.value && header?.quote_number) {
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
    <div className="flex flex-col flex-1 w-full mt-3 z-[0] ">
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
                className="px-2 py-1 rounded-md"
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

            <div className="flex border rounded-md">
              <input
                type="text"
                className="px-2 py-1 rounded-l-md"
                id="input-add-line"
                placeholder="Part Num"
                onKeyPress={(e) => e.key === 'Enter' && handleAddLine(e)}
              />
              <button
                className="flex flex-1 px-1 py-1 text-white disabled:bg-gray-400 bg-porter rounded-r-md"
                type="button"
                disabled={!header?.quote_number}
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

            <div className="flex border rounded-md">
              <select
                className="px-2 py-1 bg-white rounded-l-md"
                aria-label="Default select example"
                id="input-dw-launch"
              >
                {gymSelectOptions.map((value, index) => {
                  return (
                    <option value={index} key={`gym-select-${index}`}>
                      {value}
                    </option>
                  );
                })}
              </select>
              <button
                className="px-1 text-white disabled:bg-gray-400 input-group-text btn-primary bg-porter rounded-r-md"
                type="button"
                disabled={!header?.quote_number}
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
          adminSetting={adminSetting}
          updateMyData={(updatedInfo) => {
            const { original, index, field, value } = updatedInfo;
            const temp = { ...original };
            temp[`${field}`] = value;
            console.log('Now updating field: ', field, ' with value: ', value);
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
