'use strict';

const assert = require('assert');

const {
  encode,
  decode,
  hash,
  RESO_CONTEXT,
  RESO_UPI_URN_STEM,
  DEFAULT_UPI_VERSION,
  UPI_HASH_COMPONENT_NAME,
  URN_SEPARATOR
} = require('../');

const KNOWN_GOOD_UPI =
  'urn:reso:upi:2.0:country:US:stateorprovince:CA:county:06037:subcounty::propertytype:Residential:subpropertytype::parcelnumber: [abc] 1-2 ::   3:456 :subparcelnumber:';

const KNOWN_GOOD_UPI_HASH = 'urn:reso:upi:2.0:sha3-256-hash:427c883322af677b76d72d43d9a00c3bedd6a1ede20e43c614f710abf85549a9';

const KNOWN_GOOD_UPI_JSON = Object.freeze({
  Country: 'US',
  StateOrProvince: 'CA',
  County: '06037',
  SubCounty: null,
  PropertyType: 'Residential',
  SubPropertyType: null,
  ParcelNumber: ' [abc] 1-2 ::   3:456 ',
  SubParcelNumber: null
});

describe('UPI Encoding Tests', () => {
  describe('Known good UPI JSON can be encoded into a valid UPI', () => {
    it('should be able to parse correct data from the decoded UPI string', () => {
      const upi = encode({ upiData: KNOWN_GOOD_UPI_JSON });
      assert.equal(KNOWN_GOOD_UPI, upi);
    });
  });
});

describe('UPI Decoding Tests', () => {
  describe('Known good UPI can be decoded into valid JSON data', () => {
    it('should produce valid JSON from the decoded UPI string', () => {
      try {
        JSON.parse(JSON.stringify(decode({ upi: KNOWN_GOOD_UPI })));
        assert.ok('UPI parsing succeeded!');
      } catch (err) {
        assert.fail(`Could not parse known good UPI! ${KNOWN_GOOD_UPI}`);
      }
    });

    it('should be able to parse correct data from the decoded UPI string', () => {
      const upiData = decode({ upi: KNOWN_GOOD_UPI });
      Object.keys(upiData).forEach(standardName => {
        if (standardName !== RESO_CONTEXT) {
          assert.equal(upiData?.[standardName], KNOWN_GOOD_UPI_JSON?.[standardName]);
        }
      });
    });
  });
});

describe('UPI Hashing Tests', () => {
  describe('Known good UPI JSON can be hashed into a valid UPI hash', () => {
    const upi = encode({ upiData: KNOWN_GOOD_UPI_JSON }),
      upiHash = hash(upi);

    it('should be able to create a UPI hash that starts with the correct prefix', () => {
      const upiPrefix = [RESO_UPI_URN_STEM, DEFAULT_UPI_VERSION, UPI_HASH_COMPONENT_NAME].join(URN_SEPARATOR);
      assert.ok(upiHash?.startsWith(upiPrefix));
    });

    it('should be able to create a UPI hash that matches the known-good UPI hash', () => {
      assert.equal(KNOWN_GOOD_UPI_HASH, upiHash);
    });
  });
});
