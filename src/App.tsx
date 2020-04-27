import React from 'react';
import './App.css';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { initializeIcons } from '@uifabric/icons';
import { IconButton, IIconProps } from 'office-ui-fabric-react';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { PersonRow, ApprovalRow, CustomDatePicker } from './components/FunctionalComponents'
import { IApproval, IPerson } from './utilities/Interfaces';

interface IAppState {
  housingUnion: string;
  address: string;
  owner: string;
  isBuyer: boolean;
  caseNumber: string;
  reviewDate: Date;
  lastReportDate: Date
  takeOverDate: Date;
  persons: IPerson[];
  movedOut: boolean;
  reconstruction: boolean;
  reconstructionByCurrentOwner: boolean;
  reconstructionByFormerOwner: boolean;
  approvals: IApproval[];
  isUpdate: boolean;
  remarks: string[];
}

interface IAppProps {
}


initializeIcons();
const plusIcon: IIconProps = { iconName: 'CirclePlus' };
const options: IChoiceGroupOption[] = [
  { key: 'buyer', text: 'Køber' },
  { key: 'seller', text: 'Sælger' },
];

export default class App extends React.Component<IAppProps, IAppState>{

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      housingUnion: "",
      address: "",
      owner: "",
      isBuyer: false,
      caseNumber: "",
      reviewDate: new Date(),
      lastReportDate: new Date(),
      takeOverDate: new Date(),
      persons: [
        { name: '', mail: '', wantsReport: false, present: true },
        { name: '', mail: '', wantsReport: false, present: false }
      ],
      movedOut: false,
      reconstruction: false,
      reconstructionByCurrentOwner: false,
      reconstructionByFormerOwner: false,
      approvals: [
        { name: 'communeNotification', label: 'BYGGESAG / ANMELDELSE TIL KOMMUNEN', necessary: false, noRemark: false, recommended: false, shown: false, remark: '' },
        { name: 'vvs', label: 'VVS INSTALLATIONSGODKENDELSE', necessary: false, noRemark: false, recommended: false, shown: false, remark: '' },
        { name: 'drain', label: 'AFLØBSINSTALLATIONSGODKENDELSE', necessary: false, noRemark: false, recommended: false, shown: false, remark: '' },
        { name: 'gas', label: 'GASINSTALLATIONSGODKENDELSE', necessary: false, noRemark: false, recommended: false, shown: false, remark: '' },
        { name: 'el', label: 'EL-INSTALLATIONSGODKENDELSE', necessary: false, noRemark: false, recommended: false, shown: false, remark: '' },
      ],
      isUpdate: false,
      remarks: ['']
    }
  }

  render() {
    console.log(this.state)
    const { address, caseNumber, housingUnion, owner, reconstruction, reviewDate, lastReportDate, takeOverDate, remarks } = this.state;
    return (
      <div className="App">
        <h1>Andelsvurdering</h1>
        <div className="col-2">
          <div className="left">
            <TextField label="BOLIGFORENING" value={housingUnion} onChange={event => this.updateTextField('housingUnion', (event.target as HTMLInputElement).value)} />
            <TextField label="LEJLIGHEDENS ADRESSE" value={address} onChange={event => this.updateTextField('address', (event.target as HTMLInputElement).value)} />
            <TextField label="ANDELSHAVER" multiline value={owner} onChange={event => this.updateTextField('owner', (event.target as HTMLInputElement).value)} />

            <div>
              <ChoiceGroup options={options} onChange={(event, option) => this.setState({ isBuyer: option?.key === 'buyer' ? true : false })} />
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
          <Toggle label="Lejligheden udflyttet?" onText="Ja" offText="Nej" onChange={(ev, checked) => this.updateToggleField(ev, checked, 'movedOut')} />
          <div className='reconstruction-container'>
            <Toggle label="Ombygning foretaget?" onText="Ja" offText="Nej" onChange={(ev, checked) => this.updateToggleField(ev, checked, 'reconstruction')} />
            <div style={{ marginLeft: '20px', display: reconstruction ? 'block' : 'none' }}>
              <Checkbox label="Af denne andelshaver" onChange={(ev, checked) => this.updateCheckboxField(ev, checked, 'reconstructionByCurrentOwner')} />
              <Checkbox label="Af tidligere andelshaver" onChange={(ev, checked) => this.updateCheckboxField(ev, checked, 'reconstructionByFormerOwner')} />
            </div>
          </div>
        </div>
        {this.createApprovalRows()}
        <h2>Eventuelle Bemærkninger (Til Rapport)</h2>
        {remarks.map((remark: string, idx: number) => {
          return (
            <div style={{marginBottom : '15px'}}>
              <TextField
                value={remark}
                onChange={event => this.updateRemarks(event, idx)}
              />
            </div>
          );
        })}
        <IconButton iconProps={plusIcon} title="Ny bemærkning" ariaLabel="Plus" onClick={this.addRemarkRow}/>
      </div>
    );
  }

  private createApprovalRows(): JSX.Element {
    return (
      <div>
        {this.state.approvals.map((approval: IApproval, idx: number) => {
          return (
            <ApprovalRow
              key={idx}
              label={approval.label}
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
    return (
      <div>
        {this.state.persons.map((row: IPerson, idx: number) => {
          if (row.present === isPresent) {
            return (
              <PersonRow
                key={idx}
                wantsReport={row.wantsReport}
                onChecked={() => this.onPersonsChecked(idx)}
                onChangeMail={(e: any) => this.updatePersonValue(e, idx, 'mail')}
                onChangeName={(e: any) => this.updatePersonValue(e, idx, 'name')}
              />
            );
          }
          return null;
        })}
        <div style={{ marginBottom: '10px' }}>
          <IconButton iconProps={plusIcon} title="Ny række" ariaLabel="Plus" onClick={this.addPersonRow.bind(this, isPresent)} />
        </div>
      </div>
    )
  }

  private addPersonRow = (isPresent: boolean) => {
    const persons = [...this.state.persons,
    { name: '', mail: '', wantsReport: false, present: isPresent }
    ];

    this.setState({
      persons
    });
  }

  private updateRemarks (e : any, idx : number) {
    const remarks: any = [...this.state.remarks];
    remarks[idx] = e.target.value;
    this.setState({
      remarks,
    });
  }

  private addRemarkRow = () => {
    const remarks = [...this.state.remarks, ''];
    this.setState({ remarks })
  }

  private updateApprovalRemark(e: any, idx: number) {
    const approvals: IApproval[] = [...this.state.approvals];
    approvals[idx].remark = e.target.value;
    this.setState({
      approvals,
    });
  }

  private updateApprovalCheckbox(idx: number, property: string) {
    const approvals: any = [...this.state.approvals];
    approvals[idx][property] = !approvals[idx][property]
    this.setState({
      approvals
    })

  }

  private updateToggleField(ev: React.MouseEvent<HTMLElement, MouseEvent>, checked: boolean | undefined, property: string): void {
    this.updateState(property, checked);
  }

  private updateCheckboxField(ev: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, checked: boolean | undefined, property: string): void {
    this.updateState(property, checked);
  }

  private updateDateField = (date: Date | null | undefined, property: string): void => {
    this.updateState(property, date)
  }

  private updateTextField(property: string, newValue: string): void {
    this.updateState(property, newValue)
  }

  private updateState(property: string, newValue: any) {
    const stateObj: any = {};
    stateObj[property] = newValue;
    this.setState(stateObj)
  }

  private onPersonsChecked = (idx: number, ) => {
    const persons: IPerson[] = [...this.state.persons];
    persons[idx].wantsReport = !persons[idx].wantsReport;

    this.setState({
      persons,
    });
  }

  private updatePersonValue = (e: any, idx: number, property: string) => {
    const persons: any = [...this.state.persons];
    persons[idx][property] = e.target.value;
    this.setState({
      persons,
    });
  }



}
