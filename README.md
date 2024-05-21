[![Run Code Checks](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codecheck.yml/badge.svg)](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codecheck.yml) &nbsp; [![CodeQL](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codeql.yml/badge.svg)](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codeql.yml)


# Universal Property Identifier (UPI) Version 2.0

The UPI is a way to take a set of well-known property identifiers and encode them in a way for two parties with the same data to create matchable identifiers. This is useful for deduplicating data.

UPIs can also easily be searched on by parts and be used with Uniform Resource Identifiers (URIs) as part of a browser location or API URL, since they are friendly with existing URI standards.

## Uniform Resource Names (URNs)

[**URNs**](https://en.wikipedia.org/wiki/Uniform_Resource_Name) are a type of [**URI**](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) that allow globally unique identifiers to be created using a namespace. 

They are a general Internet standard from the Internet Assigned Numbers Authority (IANA) and the Internet Engineering Task Force (IETF), which are in many enterprise-scale applications such as Amazon Web Services (AWS) and LinkedIn.

RESO has a reserved URN that includes UPI 1.0 identifiers. [**See section 3.4.2**](https://www.iana.org/assignments/urn-formal/reso).

## URN Encoding Scheme
In order to avoid collisions with special characters and preserve data passed in the URN, UPI 2.0 takes the following approach:

> _The delimiters are the components of the UPI!_

What does this mean, in practice?

The UPI includes **country** as part of constituent data. This means it has a component called `:country:` that is also a delimiter, avoiding the need for special delimiters.

## Examples

### Decode a UPI Payload from an Encoded UPI

Assume we have the following UPI:

`urn:reso:upi:2.0:country:US:stateorprovince:CA:county:06037:subcounty::propertytype:Residential:subpropertytype::parcelnumber: [abc] 1-2 ::   3:456 :subparcelnumber:`

Let's look at the individual parts:
* `urn:reso:upi:` is the stem of the UPI, which includes both the URN prefix and upi namespace
* `2.0` is the version of the UPI
* `country` is `US` in this case (ISO Country Code)
* `stateorprovince` is `CA` for California (USPS)
* `county` is a Federal Information Processing Standards (FIPS) county code
* `subcounty` is an optional FIPS subcounty code that is empty in this case (`:subcounty::`)
* `propertytype` is an optional Data Dictionary type, in this case Residential
* `subpropertytype` is empty in this case
* `parcelnumber` shows a number of weird characters, including brackets, colons and spaces, but since the components are the delimiters, the original values are preserved
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
  '@reso.context': 'urn:reso:metadata:2.0:resource:property',
  Country: 'US',
  StateOrProvince: 'CA',
  County: '06037',
  Subcounty: null,
  PropertyType: 'Residential',
  SubpropertyType: null,
  ParcelNumber: ' [abc] 1-2 ::   3:456 ',
  SubparcelNumber: null
}
```

Note that any item without data in it is null and that all special characters are preserved in the ParcelNumber. This would be true if special characters were used in any of the values, not just ParcelNumber.


### Encode a UPI from a RESO Common Format Payload
Now let's say we have some standardized RESO data and we want to create a UPI from it. 

We can do so using the `encode` function:

```js
// Assume we're calling from the node REPL 
// and in the root of the project directory
> const { encode } = require(".");

> const upiData = {
  '@reso.context': 'urn:reso:metadata:2.0:resource:property',
  Country: 'US',
  StateOrProvince: 'CA',
  County: '06037',
  Subcounty: null,
  PropertyType: 'Residential',
  SubpropertyType: null,
  ParcelNumber: ' [abc] 1-2 ::   3:456 ',
  SubparcelNumber: null
};

> const upi = encode({upiData});

> upi
'urn:reso:upi:2.0:country:US:stateorprovince:CA:county:06037:subcounty::propertytype:Residential:subpropertytype::parcelnumber: [abc] 1-2 ::   3:456 :subparcelnumber:'
```

### Other Benefits of URNs
* Since `version` is included, different formulas could be used for different versions and accommodate future changes or improvements without making backwards-breaking changes.
* v1 URNs are also supported, but they are not encoded using the component scheme shown here. They could either be prefixed with `1.0` in place of `2.0`, or we can assume that if the data in the Data Dictionary field does not start with `urn:reso:upi`, that it's in the v1 format.
* Since the URN-based UPI essentially encodes key/value pairs, it is extensible and could even support local components.
* The URN-based UPI is self-documenting and human friendly, since each component is explicitly named. We know that the first element is `:country:` and what its value is, and that the second value is `:stateorprovince:`, etc.

# UPI Hashes

In the U.S., parcel numbers are a matter of public record. However, in other countries/scenarios, there may be some data that cannot be conveyed due to intellectual property concerns or for other reasons.

The matching and deduplication aspects of the UPI still work even when hashed. If the same components and data were used between two records, their hashes would be the same.

As for choice of hashes, since we are dealing with particularly sensitive data that others would not want shared, one-way hashing (i.e., cryptographic hashing) is a natural choice, as it sufficiently obscures the source data. They are also [**NIST**](https://csrc.nist.gov/projects/hash-functions) and global standards used in large-scale production environments like GitHub, Blockchain and Ethereum, and they have support out of the box in programming languages and frameworks. 

One-way hashes also offer collision-resistance, which is important for the universality of the UPI.

## Example
Let's assume we have the UPI created in earlier examples: 

```
urn:reso:upi:2.0:country:US:stateorprovince:CA:county:06037:subcounty::propertytype:Residential:subpropertytype::parcelnumber: [abc] 1-2 ::   3:456 :subparcelnumber:
```

To create a UPI hash from this value, use the `hash` function:

```js
// Assume we're calling from the node REPL 
// and in the root of the project directory
> const { hash } = require('.'),
  upi = 'urn:reso:upi:2.0:country:US:stateorprovince:CA:county:06037:subcounty::propertytype:Residential:subpropertytype::parcelnumber: [abc] 1-2 ::   3:456 :subparcelnumber:'

> const upiHash = hash(upi);

> upiHash

'urn:reso:upi:2.0:sha3-256-hash:427c883322af677b76d72d43d9a00c3bedd6a1ede20e43c614f710abf85549a9'
```

Note that the component representing the UPI hash also includes the method that was used for hashing. This seems practical and offers the ability to support different kinds of hashing, should the need arise. 


# Installation

## As an npm package
To install from GitHub:

```
npm i RESOStandards/reso-upi-v2
```

## Installing and Running Locally
If you would like to run the project locally and do not have them already, install [**Node**](https://nodejs.org/en/download) and [**git**](https://github.com/git-guides/install-git).

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

# Contributing
If you would like to suggest changes, [**please open a ticket**](https://github.com/RESOStandards/reso-upi-v2/issues).

If you have changes to contribute, fork the repo, clone locally, make changes, then make a PR against this repo.
