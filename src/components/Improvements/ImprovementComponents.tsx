import React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ITakenOver, ICalculated, IExpenses } from '../../utilities/Interfaces'

export interface IExpenseFieldsProps extends IExpenses {
    showOriginalPurchasedExpenseFields?: boolean;
}

const ExpenseFields = function (props: IExpenseFieldsProps) {

    const { calculatedValue, materialsExpense, totalExpense, showOriginalPurchasedExpenseFields, originalPurchasedExpense} = props;

    return (
        <div>
            {showOriginalPurchasedExpenseFields
                ?
                <TextField label="Oprindelig anskaffelsesudgift" value={originalPurchasedExpense?.toString()} type="number" placeholder={'kr.'} onChange={event => { }} />
                :
                <TextField label="Matr. udgift" value={materialsExpense?.toString()} type="number" placeholder={'kr.'} onChange={event => { }} />
            }
            <TextField label="Samlet udgift" value={totalExpense.toString()} type="number" placeholder={'kr.'} onChange={event => { }} />
            <TextField label="Beregnet værdi" value={calculatedValue.toString()} type="number" placeholder={'kr.'} onChange={event => { }} />
        </div>
    );
}

export interface ICalculatedProps extends ICalculated, ICalculatedFunctions {
    ExpenseFieldsProps: IExpenseFieldsProps;
}

export interface ICalculatedFunctions {
    onChangeImpairmentPercentage: (e: any) => void;
    onChangeHourPrice: (e: any) => void;
    onChangeHours: (e: any) => void;
    onChangeHourPrUnit: (e: any) => void;
    onChangeMaterialPrice: (e: any) => void;
}

export const Calculated = function (props: ICalculatedProps) {
    const { hourPrUnit, hourPrice, hours, materialPrice, impairmentPercentage, ExpenseFieldsProps, onChangeHourPrUnit, onChangeImpairmentPercentage, onChangeMaterialPrice } = props;
    return (
        <div className="own-work">
            <div>
                <TextField label="t/enh." type="number" value={hourPrUnit?.toString()} onChange={onChangeHourPrUnit} />
                <TextField label="Timer" type="number" value={hours?.toString()} />
                <TextField label="Nedskrivnings-%" value={impairmentPercentage?.toString()} type="number" onChange={onChangeImpairmentPercentage} />
            </div>
            <div>
                <TextField label="Matr. pris" value={materialPrice?.toString()} type="number" placeholder={'kr.'} onChange={onChangeMaterialPrice} />
                <TextField label="Timepris" value={hourPrice?.toString()} type="number" placeholder={'kr.'} />
            </div>
            <ExpenseFields calculatedValue={ExpenseFieldsProps.calculatedValue} materialsExpense={ExpenseFieldsProps.materialsExpense} totalExpense={ExpenseFieldsProps.totalExpense} />
        </div>
    );
}

export interface ITakenOverProps extends ITakenOver, ITakenOverFunctions {
    ExpenseFieldsProps: IExpenseFieldsProps;
}

export interface ITakenOverFunctions {
    onChangeImpairmentPercentage: (e: any) => void;
    onChangeTakeOverImpairmentPercentage: (e: any) => void;
}

export const TakenOver = function (props: ITakenOverProps) {
    const { impairmentPercentage, takeOverImpairmentPercentage, onChangeImpairmentPercentage,
        onChangeTakeOverImpairmentPercentage, ExpenseFieldsProps } = props;
    return (
        <div className="own-work">
            <div>
                <TextField label="Overtaget nedskr.-%" type="number" value={takeOverImpairmentPercentage?.toString()} onChange={onChangeTakeOverImpairmentPercentage} />
                <TextField label="Nedskrivnings-%" type="number" value={impairmentPercentage?.toString()} onChange={onChangeImpairmentPercentage} />
            </div>
            <ExpenseFields calculatedValue={ExpenseFieldsProps.calculatedValue} originalPurchasedExpense={ExpenseFieldsProps.originalPurchasedExpense} totalExpense={ExpenseFieldsProps.totalExpense} />
        </div>
    );
}

export const Materials = function (props: any): JSX.Element {
    const { ExpenseFieldsProps } = props;

    return (
        <div className="own-work">
            <div>
                <TextField label="Overtaget nedskr.-%" type="number" onChange={event => { }} />
                <TextField label="Nedskrivnings-%" type="number" onChange={event => { }} />
            </div>
            <ExpenseFields calculatedValue={ExpenseFieldsProps.calculatedValue} materialsExpense={ExpenseFieldsProps.materialsExpense} totalExpense={ExpenseFieldsProps.totalExpense} />
        </div>
    );
}

export const Estimated = function (props: any) {
    const { ExpenseFieldsProps } = props;

    return (
        <div className="own-work">
            <div>
                <TextField label="t/enh." type="number" onChange={event => { }} />
                <TextField label="Timer" type="number" onChange={event => { }} />
                <TextField label="Nedskrivnings-%" type="number" onChange={event => { }} />
            </div>
            <div>
                <TextField label="Matr. pris" type="number" placeholder={'kr.'} onChange={event => { }} />
                <TextField label="Timepris" type="number" placeholder={'kr.'} onChange={event => { }} />
            </div>
            <ExpenseFields calculatedValue={ExpenseFieldsProps.calculatedValue} materialsExpense={ExpenseFieldsProps.materialsExpense} totalExpense={ExpenseFieldsProps.totalExpense} />
        </div>
    );
}
export const Invoice = function (props: any) {
    const { ExpenseFieldsProps } = props;

    return (
        <div className="own-work">
            <div>
                <TextField label="Nedskrivnings-%" type="number" onChange={event => { }} />
            </div>
            <ExpenseFields calculatedValue={ExpenseFieldsProps.calculatedValue} materialsExpense={ExpenseFieldsProps.materialsExpense} totalExpense={ExpenseFieldsProps.totalExpense} />
        </div>
    );
}
