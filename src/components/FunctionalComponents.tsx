import React from 'react';
import '../App.css';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';
import { DayPickerStrings, onFormatDate } from '../utilities/Date';
import { IconButton, IIconProps } from 'office-ui-fabric-react';


export const PersonInputRow = function (props: any) {
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

export const ArrowButton = function (props: any) {
    const { arrowDirection, title, onClick } = props;

    const forwardIcon: IIconProps = { iconName: arrowDirection };

    return (
        <IconButton
            iconProps={forwardIcon}
            title={title}
            ariaLabel={title}
            onClick={onClick}
            styles={{
                icon: { fontSize: 37, color: '#e19304' },
                root: { width: 60, height: 50 }
            }}
        />
    );
}

export const PlusIconButton = function (props: any) {
    const { onClick, title } = props;
    const plusIcon: IIconProps = { iconName: 'CirclePlus' };

    return (
        <IconButton
            iconProps={plusIcon}
            title={title}
            ariaLabel="Plus"
            onClick={onClick}
            styles={
                {
                    icon: {
                        color: '#e19304',
                        fontSize: '20px'
                    }
                }}
        />
    );
}

export const BottomNavigation = function (props: any) {
    const { component, forwardArrowOnClick, backArrowOnClick } = props;
    const forwardBtn: JSX.Element = <ArrowButton
        title={'Næste'}
        arrowDirection={'Forward'}
        onClick={forwardArrowOnClick}
    />;

    const backBtn: JSX.Element = <ArrowButton
        title={'Forrige'}
        arrowDirection={'Back'}
        onClick={backArrowOnClick}
    />;

    if (component === 'GeneralInformation') {
        return (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {forwardBtn}
            </div>
        );
    } else if (component === 'Maintenance') {
        console.log("test")
        return (
            <div>
                {backBtn}
            </div>
        );
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {backBtn}
            {forwardBtn}
        </div>
    );
}