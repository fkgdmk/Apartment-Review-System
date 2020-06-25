
export interface IImpairmentResponse {
    hourlySalary: number;
    impairmentPercentage: number;
}


export class ImpairmentTable {

    public async getHourlySalary(year: number) {
        const response = await 
        fetch('http://localhost:8000/lookup/getHourlySalary?year=' + year);
        const respJson = await response.json();
        return respJson.hourlySalary;
    }

    public async getImpairmentValues(year: number, impairmentCurve?: number): Promise<IImpairmentResponse> {

        let url: string = !impairmentCurve
            ? 'http://localhost:8000/lookup/getImpairmentValues?year=' + year
            : 'http://localhost:8000/lookup/getImpairmentValues?year=' + year + '&impairmentCurve=' + impairmentCurve;

        const response = await fetch(url);
        const respJson: Promise<IImpairmentResponse> = await response.json();
        return respJson;
    }
}