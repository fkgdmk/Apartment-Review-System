import { IMaintenanceArea } from "./Interfaces";
import { IReport } from "../App";

export const populateGeneralArray = (area: string): IMaintenanceArea[] => {

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

export const saveReport = (report: IReport) : Promise<any> => {
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
            if (res.status == 200) {
                resolve(res.id);
            } else {
                reject(res.error);
            }
        })
    });
}

export const downloadReport = (id: string) : Promise<any> => {
    console.log("test", id);
    return new Promise((resolve, reject) => {
        fetch('http://localhost:8000/report/download?id=' + id)
        .then(res => {
            return res.json();
        })
        .then(res=> {
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

export const calculateImprovementValue = (totalExpense : number, impairmentPercentage : number) => {
    return Math.floor(totalExpense / 100 * impairmentPercentage);
}

//Indsæt skærings måned og år ind i stedet for 2020 og 7
export const calculateAge = (purchaseYear : number, purchaseMonth : number) =>{
    return Math.floor(((2020 - purchaseYear) * 12 + 7 - purchaseMonth)/12);
}
