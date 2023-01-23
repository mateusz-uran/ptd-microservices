export interface VehicleResponse {
    truck: Truck;
    trailer: Trailer;
    image: VehicleImage;
}

export interface Truck {
    id: string;
    model: string;
    type: string;
    licensePlate: string;
    leftTankFuelCapacity: number;
    rightTankFuelCapacity: number;
    adBlueCapacity: number;
}

export interface Trailer {
    id: string;
    type: string;
    licensePlate: string;
    fuelCapacity: string;
}

export interface VehicleImage {
    name: string;
    description: string;
    publicImageId: string;
    link: string;
}