"use strict";

const assert = require("assert");

const { encodeUpi, decodeUpi, RESO_CONTEXT } = require("../");

const KNOWN_GOOD_UPI =
  "urn:reso:upi:2.0:country:US:stateorprovince:CA:county:06037:subcounty::propertytype:Residential:subpropertytype::parcelnumber: [abc] 1-2 ::   3:456 :subparcelnumber:";

const KNOWN_GOOD_UPI_JSON = Object.freeze({
  Country: "US",
  StateOrProvince: "CA",
  County: "06037",
  SubCounty: null,
  PropertyType: "Residential",
  SubPropertyType: null,
  ParcelNumber: " [abc] 1-2 ::   3:456 ",
  SubParcelNumber: null,
});

describe("UPI Decoding Tests", () => {
  describe("Known good UPI can be decoded into valid JSON data", () => {
    it("should produce valid JSON from the decoded UPI string", () => {
      try {
        JSON.parse(JSON.stringify(decodeUpi({ upi: KNOWN_GOOD_UPI })));
        assert.ok("UPI parsing succeeded!");
      } catch (err) {
        assert.fail(`Could not parse known good UPI! ${KNOWN_GOOD_UPI}`);
      }
    });

    it("should be able to parse correct data from the decoded UPI string", () => {
      const upiData = decodeUpi({ upi: KNOWN_GOOD_UPI });
      Object.entries(upiData).forEach(([standardName]) => {
        if (standardName !== RESO_CONTEXT) {
          assert.equal(
            upiData?.[standardName],
            KNOWN_GOOD_UPI_JSON?.[standardName]
          );
        }
      });
    });
  });
});

describe("UPI Encoding Tests", () => {
  describe("Known good UPI JSON can be encoded into a valid UPI", () => {
    it("should be able to parse correct data from the decoded UPI string", () => {
      const upi = encodeUpi({ upiData: KNOWN_GOOD_UPI_JSON });
      assert.equal(KNOWN_GOOD_UPI, upi);
    });
  });
});
