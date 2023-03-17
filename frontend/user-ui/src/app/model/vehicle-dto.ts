export interface VehicleResponse {
    truck: Truck;
    trailer: Trailer;
    image: VehicleImage;
}

export interface Truck {
    id: string;
    model: string;
    truckType: string;
    truckLicensePlate: string;
    leftTankFuelCapacity: number;
    rightTankFuelCapacity: number;
    adBlueCapacity: number;
}

export interface TruckInput {
    model: string;
    truckType: string;
    truckLicensePlate: string;
    leftTankFuelCapacity: number;
    rightTankFuelCapacity: number;
    adBlueCapacity: number;
}

export interface Trailer {
    trailerType: string;
    trailerLicensePlate: string;
    trailerFuelCapacity: string;
}

export interface VehicleImage {
    vehicleImageName: string;
    vehicleImageDescription: string;
    vehicleImagePublicId: string;
    vehicleImageDirectLink: string;
}