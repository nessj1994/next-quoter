import React from "react";
import { TableInstance } from "react-table";
export const TableContext = React.createContext<TableInstance<any>>(
  {} as TableInstance
);
