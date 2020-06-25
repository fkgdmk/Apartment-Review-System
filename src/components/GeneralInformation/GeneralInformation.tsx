import React from 'react';
import '../../styles/GeneralInformationStyle.css';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { PersonInputRow, ApprovalRow, CustomDatePicker, BottomNavigation, PlusIconButton } from '../FunctionalComponents'
import { IApproval, IPerson } from '../../utilities/Interfaces';
import { connect } from 'react-redux';
import { IReport } from '../../App';
import { RouteComponentProps } from 'react-router-dom';
import { saveReport, downloadReport } from '../../utilities/HelperFunctions'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

interface IGeneralInformationProps extends IReport, RouteComponentProps {
  update: (property: string, value: any) => {};
  updateId: (id: string) => {};
  report: IReport;
}

interface IGeneralInformationState {
  hideDialog: boolean;
  unions: IDropdownOption[];
  addresses: IDropdownOption[];
  isLoading: boolean;
  dialogText: string;
}

const options: IChoiceGroupOption[] = [
  { key: 'buyer', text: 'Køber' },
  { key: 'seller', text: 'Sælger' },
];

const dialogContentProps = {
  type: DialogType.normal,
  closeButtonAriaLabel: 'Luk',
};


class GeneralInformation extends React.Component<IGeneralInformationProps, IGeneralInformationState>{

  constructor(props: IGeneralInformationProps) {
    super(props);
    this.state = {
      hideDialog: true,
      unions: [],
      addresses: [],
      isLoading: true,
      dialogText: ''
    }
  }

  render() {
    const { unions, addresses, isLoading } = this.state;
    const { addressId, caseNumber, housingUnion, owner, reconstruction, reconstructionByFormerOwner, movedOut,
      reviewDate, lastReportDate, takeOverDate, remarks, isBuyer, reconstructionByCurrentOwner } = this.props.generalInformation;

    if (isLoading) {
      return <Spinner size={SpinnerSize.large} />;
    }

    return (
      <div className="GeneralInformation">
        <div className="col-2">
          <div className="left">
            <Dropdown
              placeholder="Vælg boligforening"
              label="BBOLIGFORENING"
              options={unions}
              selectedKey={housingUnion}
              onChange={(event, option) => this.onChangeUnion(option)}
            />
            <Dropdown
              placeholder="Vælg addresse"
              label="Addresse"
              selectedKey={addressId}
              options={addresses}
              disabled={this.props.generalInformation.addressId === "" && addresses.length === 0}
              onChange={(event, option: any) => this.updateTextField('addressId', option.key)}
            />
            <TextField key={3} label="ANDELSHAVER" value={owner} onChange={event => this.updateTextField('owner', (event.target as HTMLInputElement).value)} />
            <div>
              <ChoiceGroup options={options} defaultSelectedKey={isBuyer ? 'buyer' : 'seller'} onChange={(event, option) => this.props.update('isBuyer', option?.key === 'buyer' ? true : false)} />
            </div>
          </div>
          <div className="right">
            <TextField label="SAGSNUMMER" type="number" value={caseNumber} onChange={event => this.updateTextField('caseNumber', (event.target as HTMLInputElement).value)} />
            <CustomDatePicker key={1} label='BESIGTIGELSESDATO' value={reviewDate} onSelectDate={(date: any) => this.updateDateField(date, 'reviewDate')} />
            <CustomDatePicker key={2} label='TIDLIGERE RAPPORT' value={lastReportDate} onSelectDate={(date: any) => this.updateDateField(date, 'lastReportDate')} />
            <CustomDatePicker key={3} label='OVERTAGET DATO' value={takeOverDate} onSelectDate={(date: any) => this.updateDateField(date, 'takeOverDate')} />
          </div>
        </div>
        <div>
          <label>TILSTEDE VED BESIGTIGELSEN</label>
          {this.createPersonRows(true)}
          <label>MAIL SENDES I ØVRIGT TIL</label>
          {this.createPersonRows(false)}
        </div>
        <hr />
        <h2>Generelle Oplysninger</h2>
        <div style={{ display: 'flex' }}>
          <Toggle label="Lejligheden udflyttet?" onText="Ja" offText="Nej" checked={movedOut} onChange={(ev, checked) => this.updateToggleField(ev, checked, 'movedOut')} />
          <div className='reconstruction-container'>
            <Toggle label="Ombygning foretaget?" onText="Ja" offText="Nej" checked={reconstruction} onChange={(ev, checked) => this.updateToggleField(ev, checked, 'reconstruction')} />
            <div style={{ marginLeft: '20px', display: reconstruction ? 'block' : 'none' }}>
              <Checkbox label="Af denne andelshaver" checked={reconstructionByCurrentOwner} onChange={(ev, checked) => this.updateCheckboxField(ev, checked, 'reconstructionByCurrentOwner')} />
              <Checkbox label="Af tidligere andelshaver" checked={reconstructionByFormerOwner} onChange={(ev, checked) => this.updateCheckboxField(ev, checked, 'reconstructionByFormerOwner')} />
            </div>
          </div>
        </div>
        {this.createApprovalRows()}
        <h2>Eventuelle Bemærkninger (Til Rapport)</h2>
        {remarks.map((remark: string, idx: number) => {
          return (
            <div style={{ marginBottom: '15px' }}>
              <TextField
                key={idx}
                value={remark}
                onChange={event => this.updateRemarks(event, idx)}
              />
            </div>
          );
        })}
        <PlusIconButton title={'Ny bemærkning'} onClick={this.addRemarkRow} />
        <BottomNavigation
          component={'GeneralInformation'}
          forwardArrowOnClick={() => this.props.history.push('/improvements')}
          saveReport={this.handleSaveReportClick}
        />
        <Dialog
          hidden={this.state.hideDialog}
          onDismiss={this.openDialog}
          dialogContentProps={dialogContentProps}
        >
          <div>{this.state.dialogText}</div>
          <DialogFooter>
            <DefaultButton onClick={this.openDialog} text="OK" />
          </DialogFooter>
        </Dialog>
      </div>
    );
  }

  public async componentDidMount() {
    const { housingUnion } = this.props.generalInformation;
    try {
      const res = await fetch('http://localhost:8000/union/all');
      const unions = await res.json();

      let options: IDropdownOption[] = [];
      unions.forEach((union: any) => {
        options.push({ text: union.name, key: union._id })
      });
      
      let addresses: IDropdownOption[] = [];
      if (housingUnion) {
        addresses = await this.getAddresses(housingUnion)
      }
      this.setState({ unions: options, addresses, isLoading: false })
    } catch (err) {
      console.log(err);
    }
  }

  private onChangeUnion = async (choice: any) => {
    const addresses = await this.getAddresses(choice.key);
    this.updateTextField('housingUnion', choice.key)
    this.setState({ addresses });
  }

  private getAddresses = (unionId: string): Promise<IDropdownOption[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch('http://localhost:8000/union/addresses?unionId=' + unionId);
        const addresses = await res.json();
        
        let options: IDropdownOption[] = [];
        
        addresses.forEach((a: any) => {
          options.push({ text: a.streetName + ' ' + a.number, key: a._id })
        });
        resolve(options);
      } catch (err) {
        reject();
      }
    })
  }

  private handleSaveReportClick = () => {
    saveReport(this.props.report).then(succesText => {
      console.log('text', succesText)
      this.setState({ hideDialog: false, dialogText: succesText })
    }).catch(err => {
      console.log(err);
      this.setState({ hideDialog: false, dialogText: 'Der skete en fejl' })
    });
  }

  private openDialog = () => {
    this.setState({ hideDialog: !this.state.hideDialog })
  }

  private downloadReport = () => {
    downloadReport(this.props.id);
  }


  private createApprovalRows(): JSX.Element {
    const approvals: IApproval[] = this.props.generalInformation.approvals;
    return (
      <div>
        {approvals.map((approval: IApproval, idx: number) => {
          return (
            <ApprovalRow
              key={idx}
              label={approval.label}
              approval={approval}
              onChangeRemark={(e: any) => this.updateApprovalRemark(e, idx)}
              onChangeNoRemarkCB={() => this.updateApprovalCheckbox(idx, 'noRemark')}
              onChangeNecessaryCB={() => this.updateApprovalCheckbox(idx, 'necessary')}
              onChangeRecommendedCB={() => this.updateApprovalCheckbox(idx, 'recommended')}
              onChangeShownCB={() => this.updateApprovalCheckbox(idx, 'shown')}
              noRemarkChecked={approval.noRemark}
              recommendedChecked={approval.recommended}
              necessaryChecked={approval.necessary}
              shownChecked={approval.shown}
            />
          );
        })}
      </div>
    );
  }

  private createPersonRows(isPresent: boolean): JSX.Element {
    const persons: IPerson[] = this.props.generalInformation.persons;
    return (
      <div>
        {persons.map((row: IPerson, idx: number) => {
          if (row.present === isPresent) {
            return (
              <PersonInputRow
                key={idx}
                wantsReport={row.wantsReport}
                name={row.name}
                mail={row.mail}
                onChecked={() => this.onPersonsChecked(idx)}
                onChangeMail={(e: any) => this.updatePersonValue(e, idx, 'mail')}
                onChangeName={(e: any) => this.updatePersonValue(e, idx, 'name')}
              />
            );
          }
          return null;
        })}
        <div style={{ marginBottom: '10px' }}>
          <PlusIconButton title={'Ny række'} onClick={this.addPersonRow.bind(this, isPresent)} />
        </div>
      </div>
    )
  }

  private updateRemarks(e: any, idx: number) {
    const remarks: any = [...this.props.generalInformation.remarks];
    remarks[idx] = e.target.value;
    this.props.update('remarks', remarks);
  }

  private addRemarkRow = () => {
    const remarks = [...this.props.generalInformation.remarks, ''];
    this.props.update('remarks', remarks);
  }

  private updateApprovalRemark(e: any, idx: number) {
    const approvals: IApproval[] = [...this.props.generalInformation.approvals];
    approvals[idx].remark = e.target.value;

    this.props.update('approvals', approvals);
  }

  private updateApprovalCheckbox(idx: number, property: string) {
    const approvals: any = [...this.props.generalInformation.approvals];
    approvals[idx][property] = !approvals[idx][property]
    this.props.update('approvals', approvals);
  }

  private addPersonRow = (isPresent: boolean) => {
    const persons: IPerson[] = [...this.props.generalInformation.persons,
    { name: '', mail: '', wantsReport: false, present: isPresent }
    ];
    this.props.update('persons', persons);
  }

  private onPersonsChecked = (idx: number, ) => {
    const persons: IPerson[] = [...this.props.generalInformation.persons];
    persons[idx].wantsReport = !persons[idx].wantsReport;
    this.props.update('persons', persons);
  }

  private updatePersonValue = (e: any, idx: number, property: string) => {
    const persons: any = [...this.props.generalInformation.persons];
    persons[idx][property] = e.target.value;
    this.props.update('persons', persons);
  }

  private updateToggleField(ev: React.MouseEvent<HTMLElement, MouseEvent>, checked: boolean | undefined, property: string): void {
    this.props.update(property, checked);
  }

  private updateCheckboxField(ev: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, checked: boolean | undefined, property: string): void {
    this.props.update(property, checked);
  }

  private updateDateField = (date: Date | null | undefined, property: string): void => {
    this.props.update(property, date);
  }

  private updateTextField(property: string, newValue: string): void {
    this.props.update(property, newValue);
  }
}

const mapStateToProps = (state: IReport) => ({
  generalInformation: state.generalInformation,
  id: state.id,
  report: state
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    update: (property: string, value: any) => dispatch({ type: 'UPDATE GENERALINFORMATION', payload: value, property: property }),
    updateId: (id: string) => dispatch({ type: 'UPDATE ID', payload: id })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneralInformation);