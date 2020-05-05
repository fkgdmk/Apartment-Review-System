
import React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import '../styles/ImprovementsStyle.css';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { IImprovement, ITakenOver, ICalculated } from '../utilities/Interfaces';
import { Estimated, Invoice, Materials, TakenOver, Calculated, ITakenOverProps, IExpenseFieldsProps, ICalculatedFunctions, ITakenOverFunctions } from './ImprovementComponents';
import { IImprovementDocumentation } from '../utilities/Interfaces';

const options: IChoiceGroupOption[] = [
    { key: 'improvement', text: 'Forbedring' },
    { key: 'movables', text: 'Løsøre' },
];
const impairmentCurveOptions: IChoiceGroupOption[] = [
    { key: '5', text: '5år' },
    { key: '10', text: '10år' },
    { key: '20', text: '20år' },
    { key: '30', text: '30år' },
    { key: '50', text: '50år' },
];

export interface ImprovementTypeFunctions extends ICalculatedFunctions, ITakenOverFunctions {

}

interface IImprovementCardProps {
    improvement: IImprovement;
    onChangeSubject: (e: any) => void;
    onChangeExtent: (e: any) => void;
    onChangeYear: (e: any) => void;
    onChangeMonth: (e: any) => void;
    onChangeIsImprovement: (e: any, option: any) => void;
    onChangeEstimatedValue: () => void;
    onChangeMaterialsValue: () => void;
    onChangeTakenOverValue: () => void;
    onChangeCalculatedValue: () => void;
    onChangeInvoiceValue: () => void;
    onChangeOwnWorkValue: () => void;
    onChangeImpairementCurveValue: (e: any, option: any) => void;
    ImprovementTypeOnChangeFunctions : ImprovementTypeFunctions;
}

export const ImprovementCard = function (props: IImprovementCardProps) {
    const { improvement, onChangeSubject, onChangeExtent, onChangeYear, onChangeMonth, onChangeIsImprovement,
        onChangeMaterialsValue, onChangeEstimatedValue, onChangeTakenOverValue, onChangeCalculatedValue, onChangeInvoiceValue,
        onChangeOwnWorkValue, onChangeImpairementCurveValue, ImprovementTypeOnChangeFunctions} = props;

    console.log(improvement)
    return (
        <div className="card-container">
            <div className="top-card">
                <div>
                    <TextField label="Emne" value={improvement.subject} onChange={onChangeSubject} />
                    <div className="second-row">
                        <TextField label="Omfang" value={improvement.extent.toString()} placeholder={'m2'} type="number" onChange={onChangeExtent} />
                        <div className='purchased'>
                            <TextField label="Anskaffet" value={improvement.purchased.month.toString()} placeholder={'mm'} onChange={onChangeMonth} />
                            <TextField placeholder={'åååå'} value={improvement.purchased.year.toString()} type="number" onChange={onChangeYear} />
                        </div>
                        <div>
                            <TextField label="Alder" value={improvement.age.toString()} disabled onChange={event => { }} />
                        </div>
                    </div>
                    <ChoiceGroup options={options} defaultSelectedKey={improvement.isImprovement ? 'improvement' : 'movables'} onChange={onChangeIsImprovement} />
                </div>
                <div className="col2">
                    <div style={{ marginBottom: '10px' }}>
                        <label>Dokumentation</label>
                        <div className="checkbox-row">
                            <Checkbox label="Skønnet" checked={improvement.documentation.estimated} onChange={onChangeEstimatedValue} />
                            <Checkbox label="Overtaget" checked={improvement.documentation.takenOver} onChange={onChangeTakenOverValue} />
                        </div>
                        <div className="checkbox-row">
                            <Checkbox label="Beregnet" checked={improvement.documentation.calculated} onChange={onChangeCalculatedValue} />
                            <Checkbox label="Faktura" checked={improvement.documentation.invoice} onChange={onChangeInvoiceValue} />
                        </div>
                        <div className="checkbox-row">
                            <Checkbox label="Materialer"
                                checked={improvement.documentation.estimated || improvement.documentation.calculated ? true : false}
                                onChange={onChangeMaterialsValue} />
                            <Checkbox label="Eget arbejde" checked={improvement.documentation.calculated} onChange={onChangeOwnWorkValue} />
                        </div>
                    </div>
                    <div>
                        <label>Valgt nedskrivningskurve</label>
                        <ChoiceGroup options={impairmentCurveOptions} defaultSelectedKey={improvement.impairmentCurve.toString()} onChange={onChangeImpairementCurveValue} />
                    </div>
                </div>
            </div>
            {returnImprovementTypeComponent(improvement, ImprovementTypeOnChangeFunctions)}
        </div>
    );
}

const returnImprovementTypeComponent = function (imp: IImprovement, ImprovementTypeOnChangeFunctions: ImprovementTypeFunctions): JSX.Element | null {
    const documentation: IImprovementDocumentation = imp.documentation;

    const expenseFieldsProps : IExpenseFieldsProps = {
        calculatedValue: imp.improvementType.calculatedValue,
        materialsExpense: imp.improvementType.materialsExpense,
        totalExpense: imp.improvementType.totalExpense
    }

    if (documentation.calculated) {
        return <Calculated
            hourPrUnit={imp.improvementType.hourPrUnit}
            hourPrice={imp.improvementType.hourPrice}
            hours={imp.improvementType.hours}
            impairmentPercentage={imp.improvementType.impairmentPercentage}
            materialPrice={imp.improvementType.materialPrice}
            ExpenseFieldsProps={expenseFieldsProps}
            onChangeHourPrUnit={ImprovementTypeOnChangeFunctions.onChangeHourPrUnit}
            onChangeHours={ImprovementTypeOnChangeFunctions.onChangeHours}
            onChangeHourPrice={ImprovementTypeOnChangeFunctions.onChangeHourPrice}
            onChangeImpairmentPercentage={ImprovementTypeOnChangeFunctions.onChangeImpairmentPercentage}
            onChangeMaterialPrice={ImprovementTypeOnChangeFunctions.onChangeMaterialPrice}
        />;
    } else if (documentation.takenOver) {
        return <TakenOver
            impairmentPercentage={imp.improvementType.impairmentPercentage}
            takeOverImpairmentPercentage={imp.improvementType.takeOverImpairmentPercentage}
            onChangeImpairmentPercentage={ImprovementTypeOnChangeFunctions.onChangeImpairmentPercentage}
            onChangeTakeOverImpairmentPercentage={ImprovementTypeOnChangeFunctions.onChangeTakeOverImpairmentPercentage}
            ExpenseFieldsProps={expenseFieldsProps}
        />;
    } else if (documentation.estimated) {
        return <Estimated />;
    } else if (documentation.invoice) {
        return <Invoice />;
    }

    return null;
}


const setImpairmentCurve = function (year: number, value: number) {
    return year === value ? true : false;
}