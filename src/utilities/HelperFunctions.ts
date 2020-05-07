import { IMaintenanceArea } from "./Interfaces";

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