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

export interface IApproval {
    name: string;
    noRemark: boolean;
    necessary: boolean;
    recommended: boolean;
    shown: boolean;
    remark: string;
    label: string;
}

export interface IPerson {
    name: string,
    mail: string,
    wantsReport: boolean,
    present: boolean
}

export interface IImprovements {
    general: IImprovement[];
    kitchen: IImprovement[];
    bathroom: IImprovement[];
    hall: IImprovement[];
    livingroom: IImprovement[];
}

export interface IImprovement {
    subject : string;
    // area: string;
    extent : number | string;
    purchased: { 
        month: number | string; 
        year: number | string;
    },
    age: number | string;
    isImprovement: boolean;
    documentation: IImprovementDocumentation;
    impairmentCurve: number;
}

export interface IImprovementDocumentation {
    estimated : boolean;
    takenOver : boolean; 
    invoice : boolean;
    calculated : boolean;
    materials : boolean;
    ownWork : boolean;
}