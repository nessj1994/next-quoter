import React, { PropsWithChildren, useEffect, useState } from 'react';
import { TableProperties } from '../types';

// The Table itself
function Table<T extends Record<string, unknown>>(
  props: PropsWithChildren<TableProperties<T>>,
): ReactElement {
  const {
    name,
    columns,
    onEdit,
    onClick,
    adminSetting,
    addonHooks,
    sortOptions,
  } = props;
}
