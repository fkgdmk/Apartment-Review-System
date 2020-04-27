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
    reviewDate: Date | null;
    lastReportDate: Date
    takeOverDate: Date;
    persons: IPerson[];
}

export interface IPerson {
    name: string,
    mail: string,
    wantsReport: boolean,
    present: boolean
}