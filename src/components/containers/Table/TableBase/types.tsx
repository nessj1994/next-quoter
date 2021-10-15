import { MouseEventHandler } from 'react';
import {
  Row,
  TableInstance,
  TableOptions,
  SortingRule,
  Hooks,
  UseSortByOptions,
} from 'react-table';

export interface TableProperties<T extends Record<string, unknown>>
  extends TableOptions<T> {
  name: string;
  onAdd?: (instance: TableInstance<T>) => MouseEventHandler;
  onDelete?: (instance: TableInstance<T>) => MouseEventHandler;
  onEdit?: (instance: TableInstance<T>) => MouseEventHandler;
  onClick?: (row: Row<T>) => void;
  updateMyData?: (props: any) => void;
  adminSetting?: boolean;
  skipPageReset?: boolean;
  addonHooks?: ((hooks: Hooks<any>) => void)[] | undefined;
  sortOptions?: Record<string, unknown>;
}

export type QuoteHeader = {
  QuoteID: number;
  QuoteNumber: string;
  CustID: string;
  QuoteCSR?: string;
  SalesRep?: string;
  QuoteUser: string;
  QuoteDate: string;
  AutoLength: boolean;
  ValidLength: number;
  DefaultPricing?: number;
  MultipliersID: number;
  PublicBid: boolean;
  QuoteMultiplier: number;
  PublicMultiplier: number;
  MultipliersDate: string;
  SpecialPricingEnabled: boolean;
  BidCatalogPrice: boolean;
  BidPriceMultiplier: number;
  BidHeader?: string;
  BillInfo?: string;
  Comments: string;
  PrivateComments: string;
  ShipDate?: string;
  ShipName?: string;
  ShipAddr1?: string;
  ShipAddr2?: string;
  ShipCity?: string;
  ShipState?: string;
  ShipZIP?: string;
  ShipCountry?: string;
  ShipPhone?: string;
  ShipEmail?: string;
  ShipVia?: string;
  ShipMethod?: string;
  FreightAmount?: number;
  Gyms: number;
  OldGyms: number;
  Private: boolean;
  Deleted: boolean;
  DeleteDate?: string;
  ConvertRequest: boolean;
  PONumber?: string;
  Converted: boolean;
  ConvertDate?: string;
  ConvertEscalationPercent?: number;
  Lost: boolean;
  Status?: string;
  Lock: boolean;
  LockAmount?: number;
  BidDate?: string;
  BidTypeOld?: string;
  QuotedOld?: string;
  BidStatus?: string;
  LeadType?: string;
  BidType?: string;
  Quoted?: string;
  Market?: string;
  Migrated: boolean;
};
