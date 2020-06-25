import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BottomNavigation, PlusIconButton } from '../FunctionalComponents'
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import { colors } from '../../utilities/colors';
import '../../styles/ImprovementsStyle.css';
import { ImprovementCard, ImprovementTypeFunctions } from './ImprovementCard';
import { IReport } from '../../App';
import { connect } from 'react-redux';
import { IImprovement } from '../../utilities/Interfaces';
import { ImpairmentTable, IImpairmentResponse } from '../../utilities/TableReader';
import { saveReport, calculateAge, calculateImprovementValue, 
    calculateMaterialExpense, calculateNumberOfHours, calculateTotalExpense } from '../../utilities/HelperFunctions';
interface IImprovementsProps extends RouteComponentProps, IReport {
    addImprovement: (value: any, area: string) => {};
    report : IReport;
}

interface IImprovementState {
    pivotSelected: string;
}

class Improvements extends React.Component<IImprovementsProps, IImprovementState> {

    constructor(props: IImprovementsProps) {
        super(props);
        this.state = {
            pivotSelected: 'general'
        }
    }

    render() {
        const { general, kitchen, bathroom, hall, livingroom } = this.props.improvements;

        return (
            <div className="pivot">
                <Pivot aria-label="Basic Pivot Example" linkSize={PivotLinkSize.large} styles={{
                    linkIsSelected: { selectors: { '::before': { background: colors.orange } } }
                }} onLinkClick={(e: any, option: any) => this.updatePivotSelected(e.key)}>
                    <PivotItem
                        headerText="Generelt"
                        headerButtonProps={{
                            'data-order': 1,
                            'data-title': 'General',
                        }}
                        key={'general'}
                    >
                        {this.createImprovementCards(general)}
                    </PivotItem>
                    <PivotItem key={'kitchen'} headerText="Køkken">
                        {this.createImprovementCards(kitchen)}

                    </PivotItem>
                    <PivotItem key={'bathroom'} headerText="Badeværelse">
                        {this.createImprovementCards(bathroom)}

                    </PivotItem>
                    <PivotItem key={'hall'} headerText="Entré / Gang">
                        {this.createImprovementCards(hall)}

                    </PivotItem>
                    <PivotItem key={'livingroom'} headerText="Stue og værelser">
                        {this.createImprovementCards(livingroom)}

                    </PivotItem>
                </Pivot>
                <div style={{ marginBottom: '100px' }}></div>
                <BottomNavigation
                    component={'improvements'}
                    backArrowOnClick={() => this.props.history.push('/general-information')}
                    saveReport={() => saveReport(this.props.report)}
                    forwardArrowOnClick={() => this.props.history.push('/maintenance')}
                />
            </div>
        );
    }

    private createImprovementCards(improvements: IImprovement[]): JSX.Element {

        return (
            <div>
                {improvements.map((improvement: IImprovement, idx: number) => {
                    return (
                        <ImprovementCard
                            key={idx}
                            improvement={improvement}
                            onChangeSubject={(e: any) => this.updateValue(e, idx, 'subject', improvements, false)}
                            onChangeExtent={(e: any) => this.updateValue(e, idx, 'extent', improvements, true)}
                            onChangeYear={(e: any) => this.updatePurchasedValue(e, idx, 'year', improvements)}
                            onChangeMonth={(e: any) => this.updatePurchasedValue(e, idx, 'month', improvements)}
                            onChangeIsImprovement={(e, option) => this.updateImprovementChoiceValue(option, improvements, idx)}
                            onChangeCalculatedValue={() => this.updateCheckboxValue(idx, 'calculated', improvements)}
                            onChangeEstimatedValue={() => this.updateCheckboxValue(idx, 'estimated', improvements)}
                            onChangeInvoiceValue={() => this.updateCheckboxValue(idx, 'invoice', improvements)}
                            onChangeMaterialsValue={() => this.updateCheckboxValue(idx, 'materials', improvements)}
                            onChangeOwnWorkValue={() => this.updateCheckboxValue(idx, 'ownWork', improvements)}
                            onChangeTakenOverValue={() => this.updateCheckboxValue(idx, 'takenOver', improvements)}
                            onChangeImpairementCurveValue={(e: any, option: any) => this.updateImpairementCurveChoiceValue(option, improvements, idx)}
                            ImprovementTypeOnChangeFunctions={this.returnImprovementTypeFunctions(idx, improvements)}
                        />
                    );
                })}
                <div>
                    <div style={{ marginTop: '20px' }}>
                        <PlusIconButton title={'Ny række'} onClick={this.addImprovementRow.bind(this, improvements)} />
                    </div>
                </div>
            </div>
        );

    }

    private returnImprovementTypeFunctions(idx: number, improvements: IImprovement[]): ImprovementTypeFunctions {
        return {
            onChangeImpairmentPercentage: (e: any) => this.updateImprovementTypeValue(e, idx, 'impairmentPercentage', improvements),
            onChangeTakeOverImpairmentPercentage: (e: any) => this.updateImprovementTypeValue(e, idx, 'takeOverImpairmentPercentage', improvements),
            onChangeHourPrUnit: (e: any) => this.updateImprovementTypeValue(e, idx, 'hourPrUnit', improvements),
            onChangeHourPrice: (e: any) => this.updateImprovementTypeValue(e, idx, 'hourPrice', improvements),
            onChangeHours: (e: any) => this.updateImprovementTypeValue(e, idx, 'hours', improvements),
            onChangeMaterialPrice: (e: any) => this.updateImprovementTypeValue(e, idx, 'materialPrice', improvements)
        }
    }

    private updatePivotSelected = (key: string) => {
        const trimmedKey: string = key.replace('.$', '');
        this.setState({ pivotSelected: trimmedKey });
    }

    private updateImprovementTypeValue = (e: any, idx: number, property: string, improvements: IImprovement[]) => {
        const newImprovements: any = [...improvements];
        const newValue: number = +e.target.value;
        const improvement: IImprovement = newImprovements[idx];

        newImprovements[idx].improvementType[property] = newValue;

        if (property === 'materialPrice') {
            newImprovements[idx].improvementType.materialsExpense = calculateMaterialExpense(+improvement.extent, newValue);
        } 

        if (property === 'hourPrUnit') {
            newImprovements[idx].improvementType.hours = calculateNumberOfHours(+improvement.extent, newValue)
        }

        if (improvement.improvementType.materialsExpense) {
            const totalExpense : number = calculateTotalExpense(improvement.improvementType.hourPrice, improvement.improvementType.hours, improvement.improvementType.materialsExpense)
            newImprovements[idx].improvementType.totalExpense = totalExpense;
            newImprovements[idx].improvementType.calculatedValue = calculateImprovementValue(totalExpense, improvement.improvementType.impairmentPercentage)
        }
   
        this.props.addImprovement(newImprovements, this.state.pivotSelected);
    }

    private updateValue = (e: any, idx: number, property: string, improvements: IImprovement[], isNumber: boolean) => {
        const newImprovements: any = [...improvements];
        const newValue: number = isNumber ? +e.target.value : e.target.value;
        const improvement: IImprovement = newImprovements[idx];

        newImprovements[idx][property] = newValue;

        if (property === 'extent') {
            newImprovements[idx].improvementType.materialsExpense = calculateMaterialExpense(newValue, improvement.improvementType.materialPrice)
            if (improvement.improvementType.hourPrUnit) {
                newImprovements[idx].improvementType.hours = calculateNumberOfHours(newValue, improvement.improvementType.hourPrUnit)
            }
        }

        if (improvement.improvementType.materialsExpense) {
            const totalExpense : number = calculateTotalExpense(improvement.improvementType.hourPrice, improvement.improvementType.hours, improvement.improvementType.materialsExpense)
            newImprovements[idx].improvementType.totalExpense = totalExpense;
            newImprovements[idx].improvementType.calculatedValue = calculateImprovementValue(totalExpense, improvement.improvementType.impairmentPercentage)
        }

        
        this.props.addImprovement(newImprovements, this.state.pivotSelected);
    }

    private updateImprovementChoiceValue = (option: any, improvements: IImprovement[], idx: number) => {
        const newImprovements: IImprovement[] = [...improvements];
        newImprovements[idx].isImprovement = option.key === 'improvement' ? true : false;
        this.props.addImprovement(newImprovements, this.state.pivotSelected);
    }

    private updateImpairementCurveChoiceValue = async (option: any, improvements: IImprovement[], idx: number) => {
        const newImprovements: IImprovement[] = [...improvements];
        newImprovements[idx].impairmentCurve = option.key;
        const year = newImprovements[idx].purchased.year;

        if (year) {
            const impairmentTable = new ImpairmentTable();
            const impairment: IImpairmentResponse = await impairmentTable.getImpairmentValues(year, option.key);
            newImprovements[idx].improvementType.impairmentPercentage = impairment.impairmentPercentage;
        }

        this.props.addImprovement(newImprovements, this.state.pivotSelected);
    }

    private updatePurchasedValue = async (e: any, idx: number, property: string, improvements: IImprovement[]) => {
        const newImprovements: any[] = [...improvements];
        const improvement : IImprovement = newImprovements[idx];
        const value: string = e.target.value;
        newImprovements[idx].purchased[property] = +value;

        if (improvement.purchased.year && improvement.purchased.month) {
            newImprovements[idx].age = calculateAge(improvement.purchased.year, +improvement.purchased.month);
        }

        if (property === 'year' && value.length === 4) {
            const impairmentTable = new ImpairmentTable();
            const impairementCurve = newImprovements[idx].impairmentCurve;
            let impairment: IImpairmentResponse;
            if (impairementCurve !== -1) {
                impairment = await impairmentTable.getImpairmentValues(+value, impairementCurve);
                newImprovements[idx].improvementType.impairmentPercentage = impairment.impairmentPercentage;
            } else {
                impairment = await impairmentTable.getImpairmentValues(+value);
            }

            newImprovements[idx].improvementType.hourPrice = impairment.hourlySalary;
            console.log(impairment.hourlySalary);
        }
        this.props.addImprovement(newImprovements, this.state.pivotSelected);
    }

    private updateCheckboxValue(idx: number, property: string, improvements: IImprovement[]) {
        const newImprovements: any[] = [...improvements];
        newImprovements[idx].documentation[property] = !newImprovements[idx].documentation[property]
        if (property === 'calculated') {
            newImprovements[idx].documentation.ownWork = !newImprovements[idx].documentation.ownWork;
            newImprovements[idx].documentation.materials = !newImprovements[idx].documentation.materials;
        }

        this.props.addImprovement(newImprovements, this.state.pivotSelected);
    }

    private addImprovementRow(improvements: IImprovement[]): void {

        const improvement: IImprovement = {
            subject: '',
            // area: string,
            extent: 0,
            purchased: {
                month: '',
                year: null,
            },
            age: '',
            isImprovement: true,
            documentation: {
                calculated: false,
                estimated: false,
                invoice: false,
                materials: false,
                ownWork: false,
                takenOver: false
            },
            impairmentCurve: -1,
            improvementType: {
                hourPrUnit: null,
                hourPrice: 0,
                hours: 0,
                impairmentPercentage: 0,
                materialPrice: 0, 
                takeOverImpairmentPercentage: null,
                calculatedValue: 0,
                materialsExpense: 0,
                totalExpense: 0,
                originalPurchasedExpense: 0
            }
        }

        const newImprovements: IImprovement[] = [...improvements, improvement];
        this.props.addImprovement(newImprovements, this.state.pivotSelected);
    }
}

const mapStateToProps = (state: IReport) => ({
    improvements: state.improvements,
    report : state
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        addImprovement: (value: any, property: string) => dispatch({ type: 'ADD IMPROVEMENT', payload: value, property: property })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Improvements);
