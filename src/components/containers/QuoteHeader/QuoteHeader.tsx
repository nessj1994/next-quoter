import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Formik, Form, FormikErrors } from 'formik';
import { InputField } from '../../modules/Form/InputField';
import { CheckboxField } from '../../modules/Form/CheckboxField';
import DateField from '../../modules/Form/DateField';
import TextArea from '../../modules/Form/TextArea';
import SelectField from '../../modules/Form/Select';

import useAuth from '../../../services/authLib/hooks/useAuth';
import {
  QuoteHeader,
  updateHeader,
  editing,
  setEditing,
  getQuotesState,
} from '../../../store';
import { useAppSelector, useAppDispatch } from '../../../store/hooks/hooks';
import { useSession } from 'next-auth/react';
import router, { useRouter } from 'next/router';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

// import './quote-header.scss';
interface HeaderFormValues {
  quote_date: Date;
  expire_date: Date;
  quote_user: string;
  quote_multiplier: number;
  cust_id: string;
  ship_date: Date;
  ship_name: string;
  ship_addr1: string;
  ship_addr2: string;
  ship_city: string;
  ship_state: string;
  ship_zip: string;
  ship_country: string;
  ship_phone: string;
  ship_email: string;
  ship_via: string;
  ship_method: string;
  lock: boolean;
  bid_type: string;
  market: string;
  lead_type: string;
  private: boolean;
  bid_status: string;
  bid_date: Date;
  po_number: string;
  lock_amount: number;
  migrated: boolean;
}

const Markets: Array<string> = [
  'K-12',
  'College',
  'Park/Rec',
  'Church',
  'Private',
  'Other',
];
const BidTypes: Array<string> = [
  'Sandbox',
  'Hard Bid',
  'Negotiatied',
  'Parts/Service',
];
const QuotedOptions: Array<string> = [
  'Dealer Quoted',
  'LSG Discounted',
  'LSG Reviewed & Discounted',
  'LSG Quoted & Discounted',
];

const LeadTypes: Array<string> = [
  'Owner Contacted',
  'Architect Contacted',
  'GC Contacted',
  'Lead Service/Dodge',
  'Other',
];

const ProjectStatus: Array<string> = [
  'Design Phase',
  'Sub Bidding',
  'Did not bid',
  'Bid Submitted',
  'Won',
  'Lost',
];

type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

const QuoteInfoHeader = React.memo((props: any) => {
  let today = new Date();
  let defaultExpiration = new Date();
  defaultExpiration.setDate(today.getDate() + 60);

  const dispatch = useAppDispatch();
  const quotesState = useAppSelector((state) => getQuotesState(state));
  // const SelectedQuote = useAppSelector((state) => editing(state));
  const SelectedQuote = props.quote;
  const auth = useSession();
  const router = useRouter();

  const initForm = () => {
    let formData: Partial<HeaderFormValues> = {
      ship_name: '',
      ship_email: '',
      po_number: '',
      cust_id: auth.data?.user?.customer_id,
      quote_user: auth.data?.user?.username,
      bid_type: BidTypes[0],
      market: Markets[0],
      lead_type: LeadTypes[0],
      bid_status: ProjectStatus[0],
      quote_date: today,
      expire_date: SelectedQuote?.expire_date ?? defaultExpiration,
    };

    if (SelectedQuote) {
      formData = {
        ...formData,
        ...SelectedQuote,
        quote_date: SelectedQuote?.quote_date,
      };
    }

    return formData;
  };

  const [initialValues, setInitialValues] = useState(
    initForm() as HeaderFormValues,
  );

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      let updatedValue = initForm() as HeaderFormValues;
      console.log(updatedValue);
      setInitialValues(updatedValue);
    }

    return () => {
      mounted = false;
    };
  }, [dispatch, SelectedQuote, quotesState.loading]);

  useEffect(() => {
    let mounted = true;

    if (mounted && SelectedQuote?.quote_number) {
      router.push(`/quotes/info/${SelectedQuote?.quote_number ?? ''}`);
    }

    return () => {
      mounted = false;
    };
  }, [SelectedQuote]);

  const handleSave = async (data: RequireAtLeastOne<QuoteHeader>) => {
    // dispatch here
    const updated = { ...SelectedQuote, ...data };
    return await dispatch(updateHeader(updated));
  };

  const pdfFields = [
    'quote_number',
    'quote_date',
    'expire_date',
    'quote_user',
    'cust_id',
    'ship_date',
    'ship_name',
    'ship_addr1',
    'ship_addr2',
    'ship_city',
    'ship_state',
    'ship_zip',
    'ship_country',
    'ship_phone',
    'ship_email',
    'bid_type',
  ];

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validate={(values) => {
          const errors: FormikErrors<HeaderFormValues> = {};

          if (!values.cust_id) errors.cust_id = 'Required';
          if (!values.ship_date) errors.ship_date = 'Required';
          if (!values.ship_name) errors.ship_name = 'Required';
          if (!values.bid_date) errors.bid_date = 'Required';
          // if (!values.BidType) errors.BidType = 'Required';
          // if (!values.Market) errors.Market = 'Required';
          // if (!values.LeadType) errors.LeadType = 'Required';
          // if (!values.BidStatus) errors.BidStatus = 'Required';

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          setSubmitting(true);

          handleSave(values);

          setSubmitting(false);
        }}
      >
        {({ errors, isSubmitting, handleSubmit, values, handleChange }) => (
          <Form
            className="flex flex-col w-full px-3 py-3 bg-white border rounded-md "
            id="header-form"
          >
            {/* header */}
            <div className="flex justify-between w-full gap-3 align-items-center">
              <span className="bg-white border rounded-full shadow border-1">
                <h1 className="px-3 text-3xl font-bold capitalize bg-transparent before:shadow-lg text-porter">
                  {quotesState.loading
                    ? 'loading'
                    : SelectedQuote?.quote_number ?? 'New Quote'}
                </h1>
              </span>
              {new Date(SelectedQuote?.expire_date).getTime() <
                today.getTime() && (
                <div className="h-full text-2xl font-bold text-red-500">
                  This Quote is Expired
                </div>
              )}
              <div className="flex flex-row gap-3 print:hidden">
                {new Date(SelectedQuote?.expire_date).getTime() <
                  today.getTime() && (
                  <button
                    disabled
                    title="Coming Soon"
                    className="relative items-center justify-center px-3 py-1 my-auto text-white bg-red-500 rounded-md disabled:bg-gray-300 infline-flex"
                    type="submit"
                  >
                    Reprice
                  </button>
                )}
                <button
                  disabled={isSubmitting}
                  className="relative inline-flex items-center justify-center px-3 py-1 my-auto text-white rounded shadow-lg cursor-pointer group bg-gradient-to-r from-porter to-porter-light"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    var doc = new jsPDF();
                    let printHeight = 30;
                    doc.text('Porter Custom Quoter', 10, 10);
                    doc.text(`Quote: ${SelectedQuote?.quote_number}`, 10, 20);
                    doc.line(10, 22, 200, 22);

                    pdfFields.map((field, index) => {
                      if (SelectedQuote[field] && field !== 'quote_number') {
                        // split field key into printable capitalized words
                        let key = field.replace(/_/g, ' ');

                        let words = key.split(' ');

                        for (let i = 0; i < words.length; i++) {
                          words[i] =
                            words[i].charAt(0).toUpperCase() +
                            words[i].slice(1);
                        }

                        key = words.join(' ');

                        let value = SelectedQuote[field];
                        if (field.includes('date')) {
                          value = value.split('T')[0];
                        }

                        console.log('Words: ', words, 'Field: ', field);

                        doc.text(`${key}: ${value} `, 10, printHeight);

                        printHeight += 10;
                      }
                    });
                    doc.line(10, printHeight + 2, 200, printHeight + 2);

                    // doc.text(20, 20, `Quote: ${SelectedQuote.quote_number}`);
                    autoTable(doc, {
                      html: '#line-table',
                      startY: printHeight + 10,
                      bodyStyles: {
                        cellWidth: 'auto',
                      },
                    });

                    // Output as Data URI
                    doc.output('dataurlnewwindow');
                  }}
                >
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>

                  <span className="relative">Print</span>
                </button>
                <button
                  disabled={isSubmitting}
                  className="relative inline-flex items-center justify-center px-3 py-1 my-auto text-white rounded shadow-lg cursor-pointer group bg-gradient-to-r from-porter to-porter-light"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                  <span className="relative">Save Changes</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10 mt-3 md:grid-cols-3 print:cols-1 auto-cols-auto">
              {/* card one  */}
              <div className="border rounded-md shadow">
                <h1 className="w-full py-1 pl-3 text-xl font-semibold text-white bg-porter rounded-t-md">
                  Quote Info
                </h1>
                <div className="mx-3 mb-3">
                  {auth.data?.user?.is_staff && (
                    <div className="flex items-center gap-3">
                      <div className="">
                        <label htmlFor="private">Private</label>
                        <CheckboxField className="ml-2" name="private" />
                      </div>
                      <div className="">
                        <label htmlFor="lock">Locked</label>
                        <CheckboxField className="ml-2" name="lock" />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="lock_amount">Lock Amount</label>
                        <InputField
                          name="lock_amount"
                          type="number"
                          step={10000}
                        />
                      </div>
                    </div>
                  )}

                  <div className="">
                    <label htmlFor="cust_id">Dealer</label>
                    <InputField
                      name="cust_id"
                      type="text"
                      disabled={!auth.data?.user?.is_staff}
                      placeholder="000000"
                      required
                    />
                  </div>
                  <div className="">
                    <label htmlFor="dealer_rep">Sales Rep</label>
                    <InputField
                      name="dealer_rep"
                      type="text"
                      disabled={!auth.data?.user?.is_staff}
                      placeholder=""
                      required
                    />
                  </div>
                  <div className="">
                    <label htmlFor="po_number">PO Num</label>
                    <InputField name="po_number" placeholder="0" />
                  </div>
                  <div className="flex flex-row gap-2">
                    <div className="flex-1">
                      <label htmlFor="quote_date">Quoted</label>
                      <DateField name="quote_date" required />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="expire_date">Expires</label>
                      <DateField
                        name="expire_date"
                        placeholder="stuff"
                        disabled={!auth.data?.user?.is_staff}
                        readOnly={!auth.data?.user?.is_staff}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* card two  */}
              <div className="border rounded-md shadow ">
                <h1 className="w-full py-1 pl-3 text-xl font-semibold text-white bg-porter rounded-t-md">
                  Shipping Info
                </h1>
                <div className="mx-3 mb-3">
                  <div className="row w-75">
                    <label htmlFor="ShipName print:text-purple-500">Name</label>
                    <InputField
                      name="ship_name"
                      type="text"
                      placeholder=""
                      required
                    />
                  </div>
                  <div className="row w-75">
                    <label htmlFor="ShipEmail">Email</label>
                    <InputField
                      name="ship_email"
                      type="email"
                      size={20}
                      placeholder="example@litaniasports.com"
                    />
                  </div>
                  <div className="">
                    <label htmlFor="ship_addr1">Address 1</label>
                    <InputField as="input" name="ship_addr1" type="text" />
                  </div>
                  <div className="">
                    <label htmlFor="ship_addr2">Address 2</label>
                    <InputField as="input" name="ship_addr2" type="text" />
                  </div>
                  <div className="flex flex-1 gap-2 row">
                    <div className="">
                      <label htmlFor="ship_city">City</label>
                      <InputField as="input" name="ship_city" type="text" />
                    </div>
                    <div className="col-8 col-md-4 col-lg-3">
                      <label htmlFor="ship_state">State</label>
                      <InputField
                        as="input"
                        maxLength={2}
                        size={3}
                        name="ship_state"
                        type="text"
                      />
                    </div>
                    <div className="col-8 col-md-4 col-lg-3">
                      <label htmlFor="ship_zip">ZIP</label>
                      <InputField
                        as="input"
                        size={10}
                        maxLength={5}
                        name="ship_zip"
                        type="text"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ship_date">Ship Date</label>
                    <DateField name="ship_date" required />
                  </div>
                </div>
              </div>
              {/* card  three */}
              <div className="border rounded-md shadow ">
                <h1 className="w-full py-1 pl-3 text-xl font-semibold text-white bg-porter rounded-t-md">
                  Status
                </h1>
                <div className="mx-3 mb-3">
                  <div className="flex-1">
                    <label htmlFor="comments">Comments</label>
                    <TextArea name="comments" as="textarea" type="text" />
                  </div>
                  {auth.data?.user?.is_staff && (
                    <div className="flex-1">
                      <label htmlFor="private_comments">Hidden Comments</label>
                      <TextArea
                        name="private_comments"
                        as="textarea"
                        type="text"
                      />
                    </div>
                  )}
                  <div className="">
                    <label htmlFor="bid_date">Bid Date</label>
                    <DateField name="bid_date" required />
                  </div>
                  <div className="flex flex-row gap-2">
                    <div className="">
                      <label htmlFor="bid_type">Bid Type</label>
                      <SelectField as="select" name="bid_type" type="text">
                        {BidTypes.map((val, index) => {
                          return (
                            <option key={index} value={val}>
                              {val}
                            </option>
                          );
                        })}
                      </SelectField>
                    </div>
                    <div className="">
                      <label htmlFor="lead_type">Lead Type</label>
                      <SelectField
                        as="input"
                        name="lead_type"
                        type="text"
                        required
                      >
                        {LeadTypes.map((val, index) => {
                          return (
                            <option key={index} value={val}>
                              {val}
                            </option>
                          );
                        })}
                      </SelectField>
                    </div>
                    <div className="">
                      <label htmlFor="market">Market</label>
                      <SelectField name="market" defaultValue={0}>
                        {Markets.map((val, index) => {
                          return (
                            <option key={index} value={val}>
                              {val}
                            </option>
                          );
                        })}
                      </SelectField>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2">
                    <div className="">
                      <label htmlFor="bid_status">Project Status</label>
                      <SelectField
                        as="input"
                        name="bid_status"
                        type="text"
                        required
                      >
                        {ProjectStatus.map((val, index) => {
                          return (
                            <option key={index} value={val}>
                              {val}
                            </option>
                          );
                        })}
                      </SelectField>
                    </div>
                    <div className="">
                      <label htmlFor="status_notes">Status Notes</label>
                      <InputField as="input" name="status_notes" type="text" />
                    </div>
                  </div>
                </div>
                {/* <label htmlFor="ChangeStatus">Change Status</label>
                    <SelectField as="select" name="ChangeStatus">
                      <option value={0}> </option>
                      <option value={1}>test</option>
                    </SelectField> */}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
});
QuoteInfoHeader.displayName = 'QuoteInfoHeader';
export default QuoteInfoHeader;
