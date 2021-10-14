import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { QuoteLine, QuoteLineState } from './types';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

enum ConfigLineFileTypes {
  XML = '.xml',
  CSI = '.CSI.html',
  HTML = '.html',
}
// ENTITY ADAPTER - Gives us various ways to handle state entities
const linesAdapter = createEntityAdapter<QuoteLine>({
  selectId: (line) => line?.LineID,
  sortComparer: (a, b) => {
    // multisort test
    return a.ACGymID > b.ACGymID
      ? 1
      : a.ACGymID < b.ACGymID
      ? -1
      : a.LineID > b.LineID
      ? 1
      : a.LineID < b.LineID
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
  const response = await axios.get(
    `${process.env.SERVER_HOST}/inferno/v1/quotes/lines/${quoteID}`,
    { withCredentials: true },
  );

  console.log(response);
  await dispatch(loadLines(response.data));
  dispatch(setLoading(false));
  return response;
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

    const content = await axios.get(
      `${process.env.SERVER_HOST}/inferno/v1/quotes/lines/get_conf_item_files/`,
      {
        params: {
          Quote: quoteNum,
          Gym: gymNum,
          Item: itemID,
          FileExtension: file,
        },
        withCredentials: true,
      },
    );

    console.log(content);

    dispatch(setLoading(false));

    return content;
  };

export const processGyms =
  (quoteNum: string, gymNum: number) => async (dispatch: any) => {
    const response = await axios.get(
      `${process.env.SERVER_HOST}/inferno/v1/quotes/lines/process_gym/${quoteNum}/${gymNum}`,
    );
    console.log(response.data);

    // ! Theoretically we can just add the lines, and remove / replace any that were edited, but for now reloading is easier.
    dispatch(removeAll());
    // dispatch(addLines(response.data));
    return response;
  };

export const retrieveLineConf = (lineID: number) => async (dispatch: any) => {
  const response = await axios.get(
    `${process.env.SERVER_HOST}/inferno/v1/quotes/lines/get_config/${lineID}`,
  );

  console.log(response.data);

  dispatch(editingConfig(response.data));

  return response.data;
};

export const retrieveLineCSI = (lineID: number) => async (dispatch: any) => {
  const response = await axios.get(
    `${process.env.SERVER_HOST}/inferno/v1/quotes/lines/get_csi/${lineID}`,
  );
  let newTab = window.open('/test', '_blank');

  newTab?.document.write(response.data);
  console.log(response.data);

  return response.data;
};

export const retrieveLineSpec = (lineID: number) => async (dispatch: any) => {
  const response = await axios.get(
    `${process.env.SERVER_HOST}/inferno/v1/quotes/lines/get_spec/${lineID}`,
  );
  let newTab = window.open('/test', '_blank');

  newTab?.document.write(response.data);
  console.log(response.data);

  return response.data;
};

export const updateLine = (updated: QuoteLine) => async (dispatch: any) => {
  const response = await axios.post(
    `${process.env.SERVER_HOST}/inferno/v1/quotes/lines/update_line`,
    updated,
    { withCredentials: true },
  );

  dispatch(upsertLine(updated));
  return response;
};

export const addNewLine =
  (data: { quoteID: number; partNum: string; nextLine: number }) =>
  async (dispatch: any) => {
    const requestBody = [
      {
        QuoteID: data.quoteID,
        PartNum: data.partNum,
        LineNumber: data.nextLine,
      },
    ];

    const response = await axios.post(
      `${process.env.SERVER_HOST}/inferno/v1/quotes/lines/add_line`,
      requestBody,
      { withCredentials: true },
    );

    console.log(response.data);
    if (response.data) {
      dispatch(removeAll());
      dispatch(addLines(response.data));
    }
  };

export const removeLine = (lineID: number) => async (dispatch: any) => {
  // const response = await axios.post()
  const response = await axios.get(
    `${process.env.SERVER_HOST}/inferno/v1/quotes/lines/delete_line/${lineID}`,
    {
      validateStatus(status: number) {
        let valid = status < 400;
        console.log(`Server response was valid: ${valid}`);
        return valid; // Resolve only if the status code is less than 500
      },
      withCredentials: true,
    },
  );

  if (response.data) {
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
    const response = await axios.post(
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
): Record<string, any> | null => state.lines.compList;

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
