import React from 'react';
import '../App.css';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';
import { DayPickerStrings, onFormatDate} from '../utilities/Date';
  

export const PersonRow = function (props: any) {
    const { onChangeName, onChangeMail, wantsReport, onChecked } = props;
    return (
        <div>
            <div className="present-container">
                <TextField placeholder="Fulde navn" onChange={onChangeName} />
                <TextField placeholder="Mail" onChange={onChangeMail} />
                <Checkbox label="Ønsker rapport" checked={wantsReport} onChange={onChecked} />
            </div>
        </div>
    );
}

export const ApprovalRow = function (props: any) {
    const { onChangeNoRemarkCB, onChangeNecessaryCB, necessaryChecked, onChangeRecommendedCB,
        recommendedChecked, onChangeShownCB, shownChecked, onChangeRemark, label } = props;

    const showRemarkField: string = recommendedChecked | necessaryChecked | shownChecked ? 'block' : 'none';

    return (
        <div className="approval-section">
            <div style={{ display: "flex", alignItems: 'center' }}>
                <label>{label}</label>
            </div>
            <div className="col-2 checkboxes">
                <div>
                    <Checkbox label="Ingen bemærkninger" onChange={onChangeNoRemarkCB} />
                    <Checkbox label="Nødvendig" onChange={onChangeNecessaryCB} />
                </div>
                <div>
                    <Checkbox label="Forevist" onChange={onChangeShownCB} />
                    <Checkbox label="Anbefalet" onChange={onChangeRecommendedCB} />
                </div>
            </div>
            <div style={{ display: showRemarkField }}>
                <TextField label="Bemærkning" onChange={onChangeRemark} multiline rows={0} ></TextField>
            </div>
        </div>
    );
}

export const CustomDatePicker = function (props: any) {
    const { onSelectDate, label, value } = props;
    return (
        <DatePicker
            firstDayOfWeek={DayOfWeek.Monday}
            strings={DayPickerStrings}
            formatDate={onFormatDate}
            placeholder="Vælg dato"
            ariaLabel="Vælg dato"
            label={label}
            value={value}
            onSelectDate={onSelectDate}
        />
    );
}