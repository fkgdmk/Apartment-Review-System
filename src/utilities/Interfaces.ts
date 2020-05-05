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
    extent : number | string;
    purchased: { 
        month: number | string; 
        year: number | string;
    },
    age: number | string;
    isImprovement: boolean;
    documentation: IImprovementDocumentation;
    impairmentCurve: number;
    improvementType : IImprovementType;
}

export interface IImprovementType extends ICalculated, ITakenOver, IExpenses {
}

export interface ICalculated {
    hours: number | null;
    hourPrice: number;
    materialPrice: number;
    hourPrUnit : number | null;
    impairmentPercentage: number | null;
}

export interface ITakenOver {
    takeOverImpairmentPercentage: number | null;
    impairmentPercentage: number | null;
}

export interface IExpenses {
    materialsExpense: number;
    totalExpense: number;
    calculatedValue: number;
}

export interface IImprovementDocumentation {
    estimated : boolean;
    takenOver : boolean; 
    invoice : boolean;
    calculated : boolean;
    materials : boolean;
    ownWork : boolean;
}