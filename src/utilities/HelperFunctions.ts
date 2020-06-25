import { IMaintenanceArea, IGeneralInformation } from "./Interfaces";
import { IReport } from "../App";
import { writeData } from '../utilities/utility';

export const populateMaintenanceAreaArray = (area: string): IMaintenanceArea[] => {

    let titles: string[] = ['Eltavle', 'HFI-/HpFI-Relæ', 'Stik, afbrydere, udtag', 'Vinduer og ruder', 'Vedligeholdelse',
        'Rydning', 'Rengøring'];

    switch (area) {
        case 'kitchen':
            titles = ['Loft', 'Vægge', 'Gulv', 'Træværk', 'Skabe',
                'Bordplade', 'Vægfliser'];
            break;
        case 'hall':
            titles = ['Loft', 'Vægge', 'Gulv', 'Træværk'];
            break;
        case 'bathroom':
            titles = ['Loft', 'Vægge', 'Gulv', 'Træværk', 'WC', 'Håndvask', 'Bruseinstallation', 'Vandinstallation', 'Afløbinstallation'
                , 'Ventilation'];
            break;
        case 'livingroom':
            titles = ['Loft', 'Vægge', 'Gulv', 'Træværk', 'Radiator'];
    }

    return titles.map(t => {
        return {
            title: t, remark: '', condition: { approved: false, bad: false, defective: false },
            payedBy: { seller: false, ab: false }, sellersAmount: { deduction: 0, detained: 0 }
        };
    });
}

export const fallBackGeneralInformationObj: IGeneralInformation = {
    housingUnion: "",
    addressId: "",
    owner: "",
    isBuyer: true,
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
        { name: 'vvs', label: 'VVS INSTALLATIONS-GODKENDELSE', necessary: false, noRemark: false, recommended: false, shown: false, remark: '' },
        { name: 'drain', label: 'AFLØBSINSTALLATIONS-GODKENDELSE', necessary: false, noRemark: false, recommended: false, shown: false, remark: '' },
        { name: 'gas', label: 'GASINSTALLATIONS-GODKENDELSE', necessary: false, noRemark: false, recommended: false, shown: false, remark: '' },
        { name: 'el', label: 'EL-INSTALLATIONS-GODKENDELSE', necessary: false, noRemark: false, recommended: false, shown: false, remark: '' },
    ],
    isUpdate: false,
    remarks: ['']
}

export const saveReport = (report: IReport): Promise<any> => {
    return new Promise(async (resolve, reject) => {

        try {
            if (navigator.onLine) {
                await sendReportToAPI(report);
                resolve('Raporten blev gemt');
            } else {
                await saveReportInIndexedDB(report);
                resolve('Rapporten bliver gemt, når enheden genetablerer internetforbindelsen');
            }
        } catch (err) {
            reject();
            console.log(err)
        }
    });
}

function sendReportToAPI(report: IReport): Promise<string> {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:8000/report', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(report)
        }).then(res => {
            return res.json();
        }).then(res => {
            console.log(res);
            if (res.status === 200) {
                resolve(res.id);
            } else {
                reject(res.error);
            }
        })
    });
}

function saveReportInIndexedDB(report: IReport) {
    return new Promise((resolve, reject) => {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready
                .then(function (sw) {
                    let reportObj = {
                        id: new Date().toISOString(),
                        report
                    }
                    writeData('sync-reports', reportObj)
                        .then(function () {
                            console.log("WIN")
                            sw.sync.register('sync-new-reports'); //Return er fjernet
                            resolve();
                        }).catch(function (er: any) {
                            console.log("error", er)
                            reject();
                        })
                })
        } else {
            sendReportToAPI(report)
                .then(() => resolve())
                .catch(() => reject());
        }
    })
}

export const downloadReport = (id: string): Promise<any> => {
    console.log("test", id);
    return new Promise((resolve, reject) => {
        fetch('http://localhost:8000/report/download?id=' + id)
            .then(res => {
                return res.json();
            })
            .then(res => {
                console.log(res.url)
                window.open('file:///' + res.url)
            }).catch(e => {
                console.log(e);
            })
    });
}

export const calculateMaterialExpense = (extent: number, materialPrice: number) => {
    return Math.ceil(extent * materialPrice);
}

export const calculateTotalExpense = (hourPrice: number, hours: number, materialExpense: number) => {
    return Math.ceil(materialExpense + (hourPrice * hours));
}

export const calculateNumberOfHours = (extent: number, hourPrUnit: number) => {
    return extent * hourPrUnit;
}

export const calculateImprovementValue = (totalExpense: number, impairmentPercentage: number) => {
    return Math.floor(totalExpense / 100 * impairmentPercentage);
}

//Indsæt skærings måned og år ind i stedet for 2020 og 7
export const calculateAge = (purchaseYear: number, purchaseMonth: number) => {
    return Math.floor(((2020 - purchaseYear) * 12 + 7 - purchaseMonth) / 12);
}
