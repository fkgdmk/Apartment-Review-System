import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BottomNavigation, PlusIconButton} from '../FunctionalComponents'
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import '../../styles/Maintenance.css'
import { colors } from '../../utilities/colors';
import { IMaintenanceArea } from '../../utilities/Interfaces';
import { SubjectRow } from './SubjectRow';
import { Headings, TopHeader } from './Headings';
import { IReport } from '../../App';
import { connect } from 'react-redux';
import { saveReport } from '../../utilities/HelperFunctions';


interface IMaintenanceProps extends RouteComponentProps, IReport {
    updateMaintenace: (value: any, property: string) => void;
    report : IReport;
}

interface IMaintenanceState {
    pivotSelected: string;
}

class Maintenance extends React.Component<IMaintenanceProps, IMaintenanceState> {

    constructor(props: IMaintenanceProps) {
        super(props);
        this.state = {
            pivotSelected: 'general',
        }
    }

    render() {
        const { general, kitchen, livingroom, hall, bathroom } = this.props.maintenanceAreas;
        console.log(this.props.report)
        return (
            <div>
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
                        {this.createMaintenancePivotItem(general)}
                    </PivotItem>
                    <PivotItem key={'kitchen'} headerText="Køkken">
                        {this.createMaintenancePivotItem(kitchen)}
                    </PivotItem>
                    <PivotItem key={'bathroom'} headerText="Badeværelse">
                        {this.createMaintenancePivotItem(bathroom)}
                    </PivotItem>
                    <PivotItem key={'hall'} headerText="Entré / Gang">
                        {this.createMaintenancePivotItem(hall)}
                    </PivotItem>
                    <PivotItem key={'livingroom'} headerText="Stue og værelser">
                        {this.createMaintenancePivotItem(livingroom)}
                    </PivotItem>
                </Pivot>
                <BottomNavigation
                    component={'Maintenance'}
                    saveReport={() => saveReport(this.props.report)}
                    backArrowOnClick={() => this.props.history.push('/improvements')}
                />
            </div>
        );
    }

    private createMaintenancePivotItem(maintenanceArea: IMaintenanceArea[]): JSX.Element {
        return (
            <div>
                <TopHeader />
                <Headings />
                {this.createSubjectRows(maintenanceArea)}
            </div>
        );
    }

    private createSubjectRows(maintenanceArea: IMaintenanceArea[]): JSX.Element {
        return (
            <div>
                {maintenanceArea.map((row: IMaintenanceArea, idx: number) => {
                    return (
                        <SubjectRow
                            pos={idx + 1}
                            key={idx}
                            condition={row.condition}
                            payedBy={row.payedBy}
                            remark={row.remark}
                            sellersAmount={row.sellersAmount}
                            title={row.title}
                            onChangeConditionApprovedValue={() => this.updateCheckboxValue(maintenanceArea, idx, 'condition', 'approved')}
                            onChangeCondtionBadValue={() => this.updateCheckboxValue(maintenanceArea, idx, 'condition', 'bad')}
                            onChangeCondtionDefectiveValue={() => this.updateCheckboxValue(maintenanceArea, idx, 'condition', 'defective')}
                            onChangePayedByAb={() => this.updateCheckboxValue(maintenanceArea, idx, 'payedBy', 'ab')}
                            onChangePayedBySeller={() => this.updateCheckboxValue(maintenanceArea, idx, 'payedBy', 'seller')}
                            onChangeSellersAmountDeductionValue={(e: any) => this.updateTextValue(maintenanceArea, e, idx, 'sellersAmount', 'deduction')}
                            onChangeSellersAmountDetainedValue={(e: any) => this.updateTextValue(maintenanceArea, e, idx, 'sellersAmount', 'detained')}
                            onChangeRemark={(e: any) => this.updateTextValue(maintenanceArea, e, idx, 'remark')}
                        />
                    );
                })}
            </div>
        );
    }

    private updateTextValue = (areaArray: IMaintenanceArea[], e: any, idx: number, property: string, propertysProperty?: string) => {
        const generalSubjects: any = [...areaArray];

        if (propertysProperty) {
            generalSubjects[idx][property][propertysProperty] = +e.target.value;
        } else {
            generalSubjects[idx][property] = e.target.value;
        }
        this.props.updateMaintenace(generalSubjects, this.state.pivotSelected);
        // this.setState({ general: gene\ralSubjects });
    }

    private updateCheckboxValue = (areaArray: IMaintenanceArea[], idx: number, property: string, propertiesProperty: string) => {
        const generalSubjects: any = [...areaArray];

        generalSubjects[idx][property][propertiesProperty] = !generalSubjects[idx][property][propertiesProperty];
        // this.setState({ general: generalSubjects });
        console.log("updated", generalSubjects)
        this.props.updateMaintenace(generalSubjects, this.state.pivotSelected);
    }

    private updatePivotSelected = (key: string) => {
        const trimmedKey: string = key.replace('.$', '');
        this.setState({ pivotSelected: trimmedKey });
    }
}

const mapStateToProps = (state: IReport) => ({
    maintenanceAreas: state.maintenanceAreas,
    report : state
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateMaintenace: (value: any, property: string) => dispatch({ type: 'UPDATE MAINTENANCE', payload: value, property: property })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Maintenance);