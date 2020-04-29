export interface IApproval {
    name: string;
    noRemark: boolean;
    necessary: boolean;
    recommended: boolean;
    shown: boolean;
    remark: string;
    label: string;
}

export interface IGeneralInformation {
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

export interface IPerson {
    name: string,
    mail: string,
    wantsReport: boolean,
    present: boolean
}