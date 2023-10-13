[![Run Code Checks](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codecheck.yml/badge.svg)](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codecheck.yml) &nbsp; [![CodeQL](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codeql.yml/badge.svg)](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codeql.yml)


# Universal Property Identifier (UPI) Version 2

The UPI is a way to take a set of well-known identifiers and encode them in a way such that if two parties both have the same data, they can create the identifiers and match on them. This is useful for deduplicating data.

UPIs can also easily be searched on by parts and be used with URIs as part of a browser location or API URL, since they are friendly with existing URI standards.

## Uniform Resource Names (URNs)

[**Uniform Resource Names**](https://en.wikipedia.org/wiki/Uniform_Resource_Name) are a type of [**Uniform Resource Identifier (URI)**](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) that allow globally unique identifiers to be created using a namespace. 

They are a general Internet standard from IANA and IETF, which are in many enterprise-scale applications such as AWS and LinkedIn.

RESO has a reserved URN which includes v1 UPI identifiers. [**See section 3.4.2**](https://www.iana.org/assignments/urn-formal/reso).

## URN Encoding Scheme
In order to avoid collisions with special characters and preserve data passed in the URN, UPIv2 takes the following approach:

> _The delimiters are the components of the UPI!_

What does this mean, in practice? 

The UPI includes Country as part of constituent data. This means it has a component called `:country:` which is also a delimiter. This avoids the need for special delimiters.

## Examples

### Decode a UPI Payload from an Encoded UPI

Assume we have the following UPI:

`urn:reso:upi:2.0:country:US:stateorprovince:CA:county:06037:subcounty::propertytype:Residential:subpropertytype::parcelnumber: [abc] 1-2 ::   3:456 :subparcelnumber:`

Let's look at the individual parts:
* `urn:reso:upi:` is the stem of the UPI, which includes both the URN prefix and upi namespace
* `2.0` is the version of the UPI
* `country` is `US` in this case (ISO Country Code)
* `stateorprovince` is `CA` for California (USPS)
* `county` is a FIPS county code
* `subcounty` is an optional FIPS sub-county code, however it's empty here (`:subcounty::`)
* `propertytype` is an optional Data Dictionary type, in this case Residential
* `subpropertytype` is empty in this case
* `parcelnumber` shows a number of weird characters, including brackets, colons, and spaces, but since the components are the delimeters, the original values are preserved
* `subparcelnumber` is empty in this case (no values after the last `:`)

This UPI can be decoded into a RESO Common Format payload using the `decode` function.

```js
// Assume we're calling from the node REPL 
// and in the root of the project directory
> const { decode } = require(".");

> const upi = 'urn:reso:upi:2.0:country:US:stateorprovince:CA:county:06037:subcounty::propertytype:Residential:subpropertytype::parcelnumber: [abc] 1-2 ::   3:456 :subparcelnumber:';

> const upiData = decode({ upi });

> upiData
{
  '@reso.context': 'urn:reso:metadata:2.0:property',
  Country: 'US',
  StateOrProvince: 'CA',
  County: '06037',
  SubCounty: null,
  PropertyType: 'Residential',
  SubPropertyType: null,
  ParcelNumber: ' [abc] 1-2 ::   3:456 ',
  SubParcelNumber: null
}
```

Note that any item without data in it is null, and that all special characters are preserved in the ParcelNumber. This would be true if special characters were used in any of the values, not just ParcelNumber.


### Encode a UPI from a RESO Common Format Payload
Now let's say we have some standardized RESO data and we want to create a UPI from it. 

We can do so using the `encode` function:

```js
// Assume we're calling from the node REPL 
// and in the root of the project directory
> const { encode } = require(".");

> const upiData = {
  '@reso.context': 'urn:reso:metadata:2.0:property',
  Country: 'US',
  StateOrProvince: 'CA',
  County: '06037',
  SubCounty: null,
  PropertyType: 'Residential',
  SubPropertyType: null,
  ParcelNumber: ' [abc] 1-2 ::   3:456 ',
  SubParcelNumber: null
};

> const upi = encode({upiData});

> upi
'urn:reso:upi:2.0:country:US:stateorprovince:CA:county:06037:subcounty::propertytype:Residential:subpropertytype::parcelnumber: [abc] 1-2 ::   3:456 :subparcelnumber:'
```

### Other Benefits of URNs
* Since `version` is included, different formulas could be used for different versions and accommodate future changes or improvements without making backwards-breaking changes.
* v1 URNs are also supported, they're just not encoded using the component scheme shown here. They could either be prefixed with `1.0` in place of `2.0`, above, or we can assume that if the data in the DD field does not start with `urn:reso:upi`, that it's in the v1 format.
* Since the URN-based UPI essentially encodes key/value pairs, it's extensible and could even support local components.
* The URN-based UPI is self-documenting and human friendly, since each component is explicitly named. We know that the first element is `:country:` and what its value is, and that the second value is `:stateorprovince:`, etc.

# Installation

To install from GitHub:

```
npm i RESOStandards/reso-upi-v2
```

If the installation hangs, you could follow this sequence from the command line.  If you do not have Mocha installed globally, the last line will install it locally.

 ```
> mkdir [PROJECT_LOCATION]
> cd [PROJECT_LOCATION]
> git clone https://github.com/RESOStandards/reso-upi-v2.git
> cd reso-upi-v2
> npm install
> npm install mocha
```
 To check the installation, run:
 ```
> npm run test
```

For examples of how to use this library, see [**./test**](./test/test.js).

