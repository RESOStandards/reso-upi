<img src="https://github.com/RESOStandards/reso-upi/assets/535358/a7daea5e-1f7e-408c-87a1-a2d97ca3814a" width="200">

# Overview

The RESO Universal Parcel Identifier (UPI) is a standard for a single identifier that includes both parcel numbers and the geographies of the authorities that created them. By implementing a UPI within property information records, data providers and consumers can improve data alignment across systems and avoid parcel number collisions.

The business case for the UPI is matching diverse property-related information pieces to the same parcel. A common example is for-sale property listings. A property data aggregator will often receive the same listing from multiple sources but with slightly different addresses on each listing. Some of its property listings across different geographies will have identical parcel numbers, because they come from different parcel-assigning authorities.

The UPI deduplicates these listings across addresses and authorities. It can do so for many business cases, including tax and public records, broker and agent systems, insurance records, environment data, and transactional history records.

# Definition 
The UPI shape was designed to support different geographic methods of identifier creation in one worldwide model. It uses existing national and global standards in its components.

## UPI Data Elements
The UPI uses the following data elements in its construction:
* **Country** - an [**ISO 3166**](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes) country code, e.g. US.
* **CountrySubdivision** - a country-specific formula identifying the country subdivision of the authority that issued the parcel number. In the U.S., [**GEOIDs**](https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html) are used. In the EU, [**NUTS**](https://ec.europa.eu/eurostat/web/nuts/overview) is used. Other countries may have their own country subdivision standards.
* **ParcelNumber** - the [**parcel number**](https://ddwiki.reso.org/display/DDW20/ParcelNumber+Field) for a given real property.
* **ParcelSubcomponent** - attributes such as air rights, boat slips, and other components which don't have parcel numbers themselves but are tied to an existing parcel number.


## Uniform Resource Names (URNs)
The UPI uses [**Uniform Resource Names**](https://en.wikipedia.org/wiki/Uniform_Resource_Name) for its encoding, which are a type of [**Uniform Resource Identifier (URI)**](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) that allow globally unique identifiers to be created using a namespace. For more information, see [**RFC 8141**](https://datatracker.ietf.org/doc/html/rfc8141).

RESO has a reserved URN which includes v1 UPI identifiers. [**See section 3.4.2**](https://www.iana.org/assignments/urn-formal/reso).

# Usage

The format of the UPI is as follows:

```
urn:reso:upi:<Version>:<Country>:<CountrySubdivision>:<ParcelNumber>[:sub:<ParcelSubcomponent>]
```

where the items in angle brackets are required and the items in square brackets are optional.

[**Try the UPI Builder**](./builder/index.html)

## Example: Basic UPI

```
urn:reso:upi:2.0:US:48201:R000022230
```

* `urn:reso:upi:` is the stem, including URN prefix and UPI namespace.
* `2.0` is the version of the UPI (version 1.0 was previously implemented by some companies).
* `US` is the ISO 3166 code for the United States.
* `48201` is the country subdivision for Harrison County, TX, a GEOID from the U.S Census Bureau. Country subdivisions are country specific.
* `R000022230` is the parcel number.


## Example: UPI with ParcelSubcomponent
UPIs can also be used to identify elements of a property, such as parking spaces, outbuildings, or air rights. The UPI can be extended with a `:sub:` component label followed by the ParcelSubcomponent identifier.

```
urn:reso:upi:2.0:US:48201:R000022230:sub:78 - 9.aB
```

* `:sub:` is the parcel subcomponent separator.
* `78 - 9.aB` is the identifier of one of the parcel subcomponents attached to parcel number `R000022230`.

Since the core UPI contains a fixed number of colon-separated components, special characters that exist within components of the UPI are supported. In the preceding example, the ParcelSubcomponent component has special characters.

# Considerations

## UPI Usage with Listings and Other Groupings of Parcels
There are common business cases where multiple parcels, or multiple parcel subcomponents, are grouped together. This could be a for-sale listing with multiple parcels or a for-rent listing with multiple buildings inside a single parcel.

There is demand for standardized ways to represent multiple UPIs for these kinds of business cases, which is an opportunity for future work.

## Selecting the Right Parcel IDs
While unique parcel numbers are straightforward to identify in some geographies, they are not in others. Large data aggregators who were early implementers of the UPI have found that the data sets for IDs that they select for parcels do not always match those chosen by other implementers. Without this alignment, the UPI can’t provide its intended benefit.

RESO is conducting research and will document the correct ID data sets to be utilized by implementers as real-world issues are discovered in new geographies.

## Country Subdivision Standards Outside of the U.S.
The UPI was created with the understanding that other countries will have different standards than the U.S. for how they identify the parcel-assigning authority. RESO will maintain continual outreach to international organizations to create consensus on how country subdivision for each of their geographies will be formed.

In the U.S., [**GEOIDs**](https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html) are used. In the EU, [**NUTS**](https://ec.europa.eu/eurostat/web/nuts/overview) is used. Other countries may have their own country subdivisions.

Questions? Please contact [**RESO**](mailto:info@reso.org).

## Retaining Raw Data from Sources
UPI parcel and  components should match the raw data exactly, including capitals, dashes, special characters, spaces, etc.

With version 1.0 of UPI there was an effort to simplify identifiers through stripping some characters, but further research has shown that accuracy is improved when the entire original data set is retained, as in the UPI v2.0 model.

## Transport Encodings
Since the UPI is a URN, there are rules about how special characters must be encoded when transporting data with protocols like HTTP.

For more information, see the [**section on URN syntax**](https://datatracker.ietf.org/doc/html/rfc8141#section-2) in the URN specification, and [**percent encoding**](https://datatracker.ietf.org/doc/html/rfc3986#section-2.1) in the Uniform Resource Identifier (URI) specification.

## Limits on Rights to Distribute Parcel Data
There are scenarios where the organization wanting to distribute UPIs may be restricted from distributing the actual parcel numbers based on intellectual property licensing issues or local government rules.

The matching and deduplication aspects of the UPI can still add value through a process called one-way hashing. Hashing obscures the actual data from the receiver of the hash. Instead, it provides a cryptographically hashed unique identifier that can be matched across systems, offering data collision-resistance, which is important for the universality of the UPI. 

Hashing may remove some of the intended simplicity of the UPI such as human-readability, and could add complexity for data consumers matching properties from data providers that deliver differentiated UPI data, standard vs. hashed.

### Example: Hashed UPIs

Given the UPI in the example above, 

```
urn:reso:upi:2.0:US:48201:R000022230
```

The hashed UPI, which includes both the version (`2.0`) and hash function used (`sha3-256`) is as follows:

```
urn:reso:upi:2.0:sha3-256:dc7a33c65e3aef98ea21501841f9240cdf3e7ff5441c98d824f44ddee362f1d2
```

The data used for the hash is everything from the `version` component to the end of the UPI.

# Contributors
* [**Mark Bessett** (RESO UPI Chair)](mailto:mark@smartcodefxllc.com)
* [**Matt Casey** (RESO UPI Vice-Chair)](mailto:mcasey@crsdata.com)
* [**Josh Darnell** (RESO)](mailto:josh@reso.org)
* [**Sam DeBord** (RESO)](mailto:sam@reso.org)
* [**Mark Lesswing**](mailto:mark@lesswing.com)
* **RESO UPI Workgroup**

# Contributing
If you would like to suggest changes, [**please open a ticket**](https://github.com/RESOStandards/reso-upi/issues).

If you have code changes to contribute, fork the repo, clone locally, make the changes, and then make a PR against this repo.

<a href="https://github.com/RESOStandards/reso-upi" align="middle"><img src="https://github.com/RESOStandards/reso-upi/assets/535358/b1663b4e-ca5b-4997-9654-77d6e9b07279" width="24" height="24" align="top" /><b>View on GitHub</b></a>

<br />

[![Run Code Checks](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codecheck.yml/badge.svg)](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codecheck.yml) &nbsp; [![CodeQL](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codeql.yml/badge.svg)](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codeql.yml)
