'use strict';

const DEFAULT_UPI_VERSION = '2.0',
  URN_SEPARATOR = ':',
  RESO_URN_STEM = `urn:reso:upi`,
  RESO_CONTEXT = '@reso.context';

const WELL_KNOWN_IDENTIFIERS = Object.freeze({
  [DEFAULT_UPI_VERSION]: {
    Country: 'country',
    StateOrProvince: 'stateorprovince',
    County: 'county',
    SubCounty: 'subcounty',
    PropertyType: 'propertytype',
    SubPropertyType: 'subpropertytype',
    ParcelNumber: 'parcelnumber',
    SubParcelNumber: 'subparcelnumber'
  }
});

const getWellKnownIdentifiersMap = (version = DEFAULT_UPI_VERSION) => {
  if (WELL_KNOWN_IDENTIFIERS?.[version]) {
    return WELL_KNOWN_IDENTIFIERS[version];
  } else {
    throw Error(`Invalid version: ${version}`);
  }
};

/**
 * Encodes a URN given a RESO Common Format UPI Payload
 * 
 * @example Given the following payload: 

    {
      "Country": 'US',
      "StateOrProvince": 'CA',
      "County": "06037",
      "SubCounty": null,
      "PropertyType": "Residential",
      "SubPropertyType": null,
      "ParcelNumber": " [abc] 1-2 ::   3:456 ",
      "SubParcelNumber": null
    }

  
  The output is: 
   
    'urn:reso:upi:2.0:country:US:stateorprovince:CA:county:06037:subcounty::propertytype:Residential:subpropertytype::parcelnumber: [abc] 1-2 ::   3:456 :subparcelnumber:'

 * 
 * 
 * @param {Object} params The version (default is 2.0 currently) and RESO Common Format payload of well-known parts
 * @returns a URN-encoded UPI in the given format for the version
 */
const encodeUpi = ({ version = DEFAULT_UPI_VERSION, upiData = {} }) =>
  [
    RESO_URN_STEM,
    version,
    ...Object.entries(getWellKnownIdentifiersMap(version) ?? {})?.flatMap(([ddFieldName, urnFieldName]) => [
      urnFieldName,
      upiData && upiData?.[ddFieldName] ? upiData[ddFieldName] : null
    ])
  ].join(URN_SEPARATOR);

/**
 * 
 * Decodes a UPI Payload from the URN representation.
 *
 * @example Given the following UPI: 

    'urn:reso:upi:2.0:country:US:stateorprovince:CA:county:06037:subcounty::propertytype:Residential:subpropertytype::parcelnumber: [abc] 1-2 ::   3:456 :subparcelnumber:';

  The payload is: 

    {
      "Country": 'US',
      "StateOrProvince": 'CA',
      "County": "06037",
      "SubCounty": null,
      "PropertyType": "Residential",
      "SubPropertyType": null,
      "ParcelNumber": " [abc] 1-2 ::   3:456 ",
      "SubParcelNumber": null
    }

 * 
 * @param {Object} params The version (currently 2.0) and UPI in URN format to parse
 * @returns Component data extracted and returned as a versioned RESO Common Format object
 */
const decodeUpi = ({ version = DEFAULT_UPI_VERSION, upi = '' }) => {
  const DECODING_ERROR_MESSAGE = `Malformed UPI!: ${upi}`,
    URN_PREFIX = [RESO_URN_STEM, version].join(URN_SEPARATOR);

  if (!upi || !upi?.startsWith(URN_PREFIX)) {
    throw new Error(DECODING_ERROR_MESSAGE);
  }

  const regex = new RegExp(
    Object.values(getWellKnownIdentifiersMap(version))
      .map(item => `:${item}:`)
      .join('|')
  );

  // only need the parts after the NSS
  const nss = upi.replace(URN_PREFIX, '');

  if (version === DEFAULT_UPI_VERSION) {
    const [, ...parts] = nss.split(regex);

    // parts and the well-known keys should always match
    if (!parts && parts?.length && parts.length === Object.values(getWellKnownIdentifiersMap(version)?.length)) {
      throw new Error(DECODING_ERROR_MESSAGE);
    }

    return {
      [RESO_CONTEXT]: `urn:reso:metadata:${version}:property`,
      ...Object.keys(getWellKnownIdentifiersMap(version)).reduce((acc, key, i) => {
        acc[key] = parts?.[i]?.length ? parts[i] : null;
        return acc;
      }, {})
    };
  } else {
    throw new Error(`Unsupported version: ${version}!`);
  }
};

/**
 * Validates URN-based UPIs
 *
 * @param {String} upi URN representation of the UPI
 * @returns true if the representation is valid for the given version, which is encoded in the URN, false otherwise
 */
const validateUpi = upi => upi && false; //TODO

module.exports = {
  RESO_CONTEXT,
  decodeUpi,
  encodeUpi,
  validateUpi
};
