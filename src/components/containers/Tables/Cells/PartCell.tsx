import React, { useState, useEffect } from 'react';
// import * as Icons from 'react-bootstrap-icons';
import { Cell, CellProps } from 'react-table';
import { useRouter } from 'next/router';
import { DocumentDownloadIcon, DownloadIcon } from '@heroicons/react/outline';
import Dropdown from '../../../elements/dropdown-menu';
import {
  QuoteLine,
  useAppDispatch,
  retrieveFile,
  retrieveLineConf,
  retrieveLineCSI,
  retrieveLineSpec,
} from 'store';

enum FileType {
  XML = '.xml',
  CSI = 'CSI.html',
  HTML = '.html',
}

const PartCell = (props: CellProps<QuoteLine>): JSX.Element => {
  const {
    row: { original },
    column,
  } = props;
  const history = useRouter();
  const dispatch = useAppDispatch();
  const handleFileBtn = async (data: {
    lineID: number;
    itemID?: string;
    gymNum?: number;
    fileExt?: string;
  }) => {
    console.log(data);
    // Grab the individual values from the passed in data
    const { itemID, gymNum, fileExt, lineID } = data;

    switch (fileExt) {
      case FileType.XML:
        await dispatch(retrieveLineConf(lineID));
        history.push(`/quotes/line-config/${lineID}`);
        break;
      case FileType.HTML:
        await dispatch(retrieveLineSpec(lineID));
        console.log('boop');
        break;
      case FileType.CSI:
        await dispatch(retrieveLineCSI(lineID));
        console.log('boop');
        break;
      default:
        console.log('lack of boop');
        break;
    }
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between">
          <p>{original?.part_num?.toUpperCase()}</p>
          {original.ac_gym_id !== 0 && (
            <div>
              <Dropdown
                items={[
                  {
                    itemLabel: 'Components',
                    linkPath: '#',
                    component: 'button',
                    onClick: () => {
                      handleFileBtn({
                        itemID: original.ac_item_id!,
                        gymNum: original?.ac_gym_id!,
                        fileExt: FileType.XML,
                        lineID: original?.line_id,
                      });
                    },
                  },
                  {
                    itemLabel: 'Configuration',
                    linkPath: '#',
                    component: 'button',
                    onClick: () => {
                      handleFileBtn({
                        itemID: original.ac_item_id!,
                        gymNum: original?.ac_gym_id!,
                        fileExt: FileType.HTML,
                        lineID: original?.line_id,
                      });
                    },
                  },
                  {
                    itemLabel: 'CSI Spec',
                    linkPath: '#',
                    component: 'button',
                    onClick: () => {
                      handleFileBtn({
                        itemID: original.ac_item_id!,
                        gymNum: original?.ac_gym_id!,
                        fileExt: FileType.CSI,
                        lineID: original?.line_id,
                      });
                    },
                  },
                ]}
              >
                <DocumentDownloadIcon className="inline w-5 h-5 mx-1" />
              </Dropdown>
            </div>
          )}
        </div>
        <div className="flex-1 text-sm font-normal capitalize truncate ">
          {original?.part_description}
        </div>
      </div>
    </>
  );
};

export default PartCell;
