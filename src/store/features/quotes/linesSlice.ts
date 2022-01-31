import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { QuoteLine, QuoteLineState } from './types';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';
import { LineComponent } from 'store';

import initAPIConnection from 'services/api/apiConnector';

const api = initAPIConnection({});
enum ConfigLineFileTypes {
  XML = '.xml',
  CSI = '.CSI.html',
  HTML = '.html',
}
// ENTITY ADAPTER - Gives us various ways to handle state entities
const linesAdapter = createEntityAdapter<QuoteLine>({
  selectId: (line) => line?.line_id,
  sortComparer: (a, b) => {
    // multisort test
    return a.ac_gym_id > b.ac_gym_id
      ? 1
      : a.ac_gym_id < b.ac_gym_id
      ? -1
      : a.line_id > b.line_id
      ? 1
      : a.line_id < b.line_id
      ? -1
      : 0;
  },

  //   return a.LineNumber === b.LineNumber
  //     ? 0
  //     : a.LineNumber > b.LineNumber
  //     ? 1
  //     : -1;
  // },
});

// Declare our initial state
const initialState = linesAdapter.getInitialState<QuoteLineState>({
  loading: false,
  totalPrice: 0,
});

// Create a state slice for our lines
// This will both reduce and generate actions
// ! WE CAN ONLY MUTATE STATE BECAUSE OF IMMER

const linesSlice = createSlice({
  name: 'lines',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    loadLines: linesAdapter.addMany,
    addLine: linesAdapter.upsertOne,
    addLines: linesAdapter.upsertMany,
    upsertLine: linesAdapter.upsertOne,
    deleteLine: linesAdapter.removeOne,
    removeAll: linesAdapter.removeAll,
    editingConfig: (state, action) => {
      return { ...state, compList: action.payload };
    },
    addLineComponent: (state, action) => {
      return { ...state, compList: [...state.compList, action.payload] };
    },
  },
});

// Thunks
export const fetchLines = (quoteID: number) => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(removeAll());
  const { data }: AxiosResponse<{ results: Array<QuoteLine> }, any> =
    await api.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/quotes/lines/?quote_id=${quoteID}`,
      { withCredentials: true },
    );

  console.log(data.results);
  await dispatch(loadLines(data.results));
  dispatch(setLoading(false));
  return data.results;
};

export const retrieveFile =
  (
    quoteNum: string,
    gymNum: number,
    itemID: string,
    file:
      | ConfigLineFileTypes.CSI
      | ConfigLineFileTypes.XML
      | ConfigLineFileTypes.HTML,
  ) =>
  async (dispatch: any) => {
    dispatch(setLoading(true));

    // const content = await api.get(
    //   `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/quotes/lines/get_conf_item_files/`,
    //   {
    //     params: {
    //       Quote: quoteNum,
    //       Gym: gymNum,
    //       Item: itemID,
    //       FileExtension: file,
    //     },
    //     withCredentials: true,
    //   },
    // );

    // console.log(content);

    // const content = await api.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/quotes/lines/${``}`);

    dispatch(setLoading(false));

    return content;
  };

export const processGyms =
  (quoteNum: string, gymNum: number) => async (dispatch: any) => {
    const response = await api.post(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/quotes/headers/${quoteNum}/process_gym/${gymNum}/`,
    );
    console.log(response.data);

    // ! Theoretically we can just add the lines, and remove / replace any that were edited, but for now reloading is easier.
    dispatch(removeAll());
    // dispatch(addLines(response.data));
    return response;
  };

export const retrieveLineConf = (lineID: number) => async (dispatch: any) => {
  const response = await api.get(
    `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/quotes/lines/${lineID}/get_config/`,
  );

  console.log(response.data.data);

  dispatch(editingConfig(response.data.data));

  return response.data.data;
};

export const retrieveLineCSI = (lineID: number) => async (dispatch: any) => {
  const response = await api.get(
    `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/quotes/lines/${lineID}/get_csi_file/`,
  );
  let newTab = window.open('/test', '_blank');

  newTab?.document.write(response.data);
  console.log(response.data);

  return response.data;
};

export const retrieveLineSpec = (lineID: number) => async (dispatch: any) => {
  const response = await api.get(
    `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/quotes/lines/${lineID}/get_spec_file/`,
  );
  let newTab = window.open('/test', '_blank');

  newTab?.document.write(response.data);
  console.log(response.data);

  return response.data;
};

export const updateLine = (updated: QuoteLine) => async (dispatch: any) => {
  const response = await api.patch(
    `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/quotes/lines/${updated.line_id}/`,
    updated,
    { withCredentials: true },
  );
  console.log(updated);
  dispatch(upsertLine(response.data));
  return response;
};

export const addNewLine =
  (line: { quoteID: number; partNum: string; nextLine: number }) =>
  async (dispatch: any) => {
    const requestBody = {
      quote_id: line.quoteID,
      part_num: line.partNum,
      line_number: line.nextLine,
      enabled: true,
    };

    const { data: lineData }: AxiosResponse<QuoteLine[], any> = await api.post(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/quotes/headers/${line.quoteID}/add_line/`,
      { ...requestBody },
      { withCredentials: true },
    );

    let arr = [lineData];

    console.log(...arr);
    if (lineData) {
      dispatch(addLines(lineData));
    }
  };

export const removeLine = (lineID: number) => async (dispatch: any) => {
  // const response = await axios.post()
  const response = await api.delete(
    `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/quotes/lines/${lineID}/`,
    {
      validateStatus(status: number) {
        let valid = status < 400;
        console.log(`Server response was valid: ${valid}`);

        return valid; // Resolve only if the status code is less than 500
      },
      withCredentials: true,
    },
  );
  console.log(response);

  if (response.status === 204) {
    console.log(lineID);
    dispatch(deleteLine(lineID));
  }
};

export const emptyLines = () => async (dispatch: any) => {
  dispatch(removeAll());
};

export const addComponent =
  (data: { lineID: number; partNum: string; qty: number; type: string }) =>
  async (dispatch: any) => {
    const requestBody = {
      LineID: data.lineID,
      PartNum: data.partNum,
      Quantity: data.qty,
      Type: data.type,
    };
    const response = await api.post(
      `${process.env.SERVER_HOST}/inferno/v1/quotes/lines/add_component`,
      requestBody,
      { withCredentials: true },
    );
    if (response.data) {
      dispatch(addLineComponent(response.data));
    }
  };

export const selectComponents = (
  state: RootState,
): Array<LineComponent> | null => state.lines.compList;

// Retrieve linesSlice components separately
const linesSliceActions = linesSlice.actions;
const linesSliceReducer = linesSlice.reducer;

// Selectors
export const quoteLinesSelectors = linesAdapter.getSelectors(
  (state: RootState) => state.lines,
);

export const {
  loadLines,
  addLine,
  addLines,
  deleteLine,
  upsertLine,
  setLoading,
  removeAll,
  editingConfig,
  addLineComponent,
} = linesSliceActions;
export { linesSliceActions, linesSliceReducer };

export default linesSlice;
