export interface IAddress {
    country: string;
    state: string;
    city: string;
    district: string;
    street: string;
    number: string;
    zipCode: string;
    complement: string;
}

export interface IProfile {
    id: string;
    name: string;
    email: string;
    cpf: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: IAddress;
    memberType: number;
    observation?: string;
}
