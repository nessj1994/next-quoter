import React, { useState, useEffect } from 'react';
// import * as Icons from 'react-bootstrap-icons';
import { Cell, CellProps } from 'react-table';
import { useHistory } from 'react-router-dom';
import Dropdown from '../../../containers/dropdown-menu';
import {
  QuoteLine,
  useAppDispatch,
  retrieveFile,
  retrieveLineConf,
  retrieveLineCSI,
  retrieveLineSpec,
} from '../../../../store';
import zIndex from '@material-ui/core/styles/zIndex';

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
  const history = useHistory();
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
        history.push(`./line-config/${lineID}`);
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
      <div
        style={{
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        <div className="mb-3">
          <span style={{ zIndex: 99999999999999, position: 'absolute' }}>
            {original?.PartNum?.toUpperCase()}
            {original?.ACGymID !== 0 && (
              <Dropdown
                items={[
                  {
                    itemLabel: 'Components',
                    linkPath: '#',
                    component: 'button',
                    onClick: () => {
                      handleFileBtn({
                        itemID: original.ACItemID!,
                        gymNum: original?.ACGymID!,
                        fileExt: FileType.XML,
                        lineID: original?.LineID,
                      });
                    },
                  },
                  {
                    itemLabel: 'Configuration',
                    linkPath: '#',
                    component: 'button',
                    onClick: () => {
                      handleFileBtn({
                        itemID: original.ACItemID!,
                        gymNum: original?.ACGymID!,
                        fileExt: FileType.HTML,
                        lineID: original?.LineID,
                      });
                    },
                  },
                  {
                    itemLabel: 'CSI Spec',
                    linkPath: '#',
                    component: 'button',
                    onClick: () => {
                      handleFileBtn({
                        itemID: original.ACItemID!,
                        gymNum: original?.ACGymID!,
                        fileExt: FileType.CSI,
                        lineID: original?.LineID,
                      });
                    },
                  },
                ]}
              >
                <i className="bi bi-files" />
              </Dropdown>
            )}
          </span>
        </div>

        <br />
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span>{original?.PartDescription?.toUpperCase()}</span>
        </div>
      </div>
    </>
  );
};

export default PartCell;
