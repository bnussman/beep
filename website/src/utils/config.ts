export const config = {
    apiUrl: (process.env.NODE_ENV === 'production' ? 'https://ridebeep.app/v1' : 'http://localhost:3001'),
    //apiUrl: (process.env.NODE_ENV === 'production' ? 'https://ridebeep.app/v1' : 'https://dev.ridebeep.app/v1'),
    baseUrl: (process.env.NODE_ENV === 'production' ? 'https://ridebeep.app/' : 'http://localhost:3000/')
    //baseUrl: (process.env.NODE_ENV === 'production' ? 'https://ridebeep.app/' : 'https://dev.ridebeep.app/')
};
