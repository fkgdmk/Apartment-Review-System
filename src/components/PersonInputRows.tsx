import React from 'react';
import '../App.css';
import { PersonInputRow } from './FunctionalComponents';
import { IconButton, IIconProps } from 'office-ui-fabric-react';
import { IPerson } from '../utilities/Interfaces';

const plusIcon: IIconProps = { iconName: 'CirclePlus' };

export const PersonInputRows = function (props : any) {
    const {isPresent, onChecked, onChangeMail, onChangeName, persons, addPersonRow} = props;
    return (
      <div>
        {persons.map((row: IPerson, idx: number) => {
          if (row.present === isPresent) {
            return (
              <PersonInputRow
                key={idx}
                wantsReport={row.wantsReport}
                onChecked={onChecked}
                onChangeMail={onChangeMail}
                onChangeName={onChangeName}
              />
            );
          }
          return null;
        })}
        <div style={{ marginBottom: '10px' }}>
          <IconButton iconProps={plusIcon} title="Ny række" ariaLabel="Plus" onClick={addPersonRow} />
        </div>
      </div>
    )
  } 