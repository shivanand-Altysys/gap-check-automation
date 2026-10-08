// data/countryData.ts

import { CountryData } from '../types';

/**
 * Default template for generated countries
 */
export const DefaultCountryTemplate: Partial<CountryData> = {
  isoNumericCode: '999',
  administrativeDivisionId: 'WI-TST',
};

//  Static Existing country data
export const ExistingCountryData: Partial<CountryData> = {
  title: 'India',
  slug: 'in',
};

export const InvalidCountryData: Partial<CountryData> = {
  title: 'United Kingdom of Great Britain and Northern Ireland Test Country Validation Example Extra Characters 1234567890 Test Country',
  slug: 'country@123',
  isoNumericCode: '12345678901',
  administrativeDivisionId:
    'ADMIN-DIVISION-ID-ABCDEFGHIJKLMNOPQRSTUVWXYZ-1234567890-EXCEEDING-LIMIT-1234567890'
};