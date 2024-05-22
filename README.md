[![Run Code Checks](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codecheck.yml/badge.svg)](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codecheck.yml) &nbsp; [![CodeQL](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codeql.yml/badge.svg)](https://github.com/RESOStandards/reso-upi-v2/actions/workflows/codeql.yml)

# RESO Universal Property Identifier (UPI)

The RESO Universal Property Identifier (UPI) is a standard for a single identifier that includes both parcel numbers and the geographies of the authorities that created them. By implementing a UPI within property information records, data providers and consumers can improve data alignment across systems and avoid parcel number collisions.

The business case for the UPI is matching diverse property-related information pieces to the same parcel. A common example is for-sale property listings. A property data aggregator will often receive the same listing from multiple sources but with slightly different addresses on each listing. Some of its property listings across different geographies will have identical parcel numbers, because they come from different parcel-assigning authorities.

The UPI deduplicates these listings across addresses and authorities. It can do so for many business cases, including tax and public records, broker and agent systems, insurance records, environment data, and transactional history records.

# Definition 
The UPI shape was designed to support different geographic methods of identifier creation in one worldwide model. It uses existing national and global standards in its components.

## UPI Data Elements
The UPI uses the following data elements in its construction:
* **Country** - an [ISO 3166](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes) country code, e.g. US.
* **SubCountry** - a country-specific formula identifying the country subdivison of the authority that issued the parcel number. In the U.S., [GEOIDs](https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html) are used. In the EU, [NUTS](https://ec.europa.eu/eurostat/web/nuts/overview) is used. Other countries may have their own country subdivisions.
* **ParcelNumber** - the [parcel number](https://ddwiki.reso.org/display/DDW20/ParcelNumber+Field) for a given real property.
* **SubParcelNumber** - the sub-parcel, when applicable.


## Uniform Resource Names (URNs)
The UPI uses [**Uniform Resource Names**](https://en.wikipedia.org/wiki/Uniform_Resource_Name) for its encoding, which are a type of [**Uniform Resource Identifier (URI)**](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) that allow globally unique identifiers to be created using a namespace. For more information, see [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986).

RESO has a reserved URN which includes v1 UPI identifiers. [**See section 3.4.2**](https://www.iana.org/assignments/urn-formal/reso).

# Usage

The format of the UPI is as follows:

```
urn:reso:upi:<Version>:<Country>:<SubCountry>:<ParcelNumber>[:sub:<SubParcelNumber>]
```

where the items in square brackets are optional.

[**Try the UPI Builder**](./html/upi-builder.html)!

## Example: Basic UPI

```
urn:reso:upi:2.0:US:48201:R000022230
```

* `urn:reso:upi:` is the stem, including URN prefix and UPI namespace.
* `2.0` is the version of the UPI (version 1.0 was previously implemented by some companies).
* `US` is the ISO 3166 code for the United States.
* `48201` is the SubCountry (_not to be confused with subcounty_) for Harrison County, TX, a GEOID from the U.S Census Bureau (the method for identifying Subcountry is country-specific).
* `R000022230` is the parcel number.


## Example: UPI with SubParcelNumber
UPIs can also be used to identify subparcel elements of a property, such as parking spaces, outbuildings or air rights. The UPI, with its fixed number of preparcel components separated by colons, can be extended with a :sub: component label followed by the subparcel item identifier.

```
urn:reso:upi:2.0:US:48201:R000022230:sub:78 - 9.aB
```

* `:sub:` is the extended component label.
* `78 - 9.aB` is the subparcel identifier for one of many property elements on the parcel.

Since the core UPI contains a fixed number of colon-separated components, special characters that exist within components of the UPI are supported. Even colons within a parcel number will be identified as such because of the fixed number of preparcel components for the overall model. In the preceding example, the SubParcelNumber component has special characters.

# Considerations

## UPI Usage with Listings and Other Groupings of Parcels
There are common business cases where multiple parcels, or multiple subparcel elements, are grouped together. This could be a for-sale listing with multiple parcels or a for-rent listing with multiple buildings inside a single parcel.

There is demand for standardized ways to represent multiple UPIs for these kinds of business cases, which is an opportunity for future work.

## Selecting the Right Parcel IDs
While unique parcel numbers are straightforward to identify in some geographies, they are not in others. Large data aggregators who were early implementers of the UPI have found that the data sets for IDs that they select for parcels do not always match those chosen by other implementers. Without this alignment, the UPI can’t provide its intended benefit.

RESO is conducting research and will document the correct ID data sets to be utilized by implementers as real-world issues are discovered in new geographies.

## Developing SubCountry Standards for More Countries
The UPI was created with the understanding that other countries will have different standards than the U.S. for how they identify the parcel-assigning authority. RESO will maintain continual outreach to international organizations to create consensus on how the SubCountry component for each of their geographies will be formed.

In the U.S., [GEOIDs](https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html) are used. In the EU, [NUTS](https://ec.europa.eu/eurostat/web/nuts/overview) is used. Other countries may have their own country subdivisions.

## Retaining Raw Data from Sources
UPI parcel and subparcel components should match the raw data exactly, including capitals, dashes, special characters, spaces, etc.

With version 1.0 of UPI there was an effort to simplify identifiers through stripping some characters, but further research has shown that accuracy is improved when the entire original data set is retained, as in the UPI v2.0 model.

## Limits on Rights to Distribute Parcel Data
There are scenarios where the organization wanting to distribute UPIs may be restricted from distributing the actual parcel numbers based on intellectual property licensing issues or local government rules.

The matching and deduplication aspects of the UPI can still add value through a process called one-way hashing. Hashing obscures the actual data from the receiver of the hash. Instead, it provides a cryptographically hashed unique identifier that can be matched across systems, offering data collision-resistance, which is important for the universality of the UPI. 

Hashing may remove some of the intended simplicity of the UPI such as human-readability, and could add complexity for data consumers matching properties from data providers that deliver differentiated UPI data, standard vs. hashed.

### Example: Hashed UPIs

Given the UPI in the example above, 

```
urn:reso:upi:2.0:US:48201:R000022230
```

The hashed version is as follows:

```
urn:reso:upi:2.0:sha3-256:dc7a33c65e3aef98ea21501841f9240cdf3e7ff5441c98d824f44ddee362f1d2
```


# Contributing
If you would like to suggest changes, [**please open a ticket**](https://github.com/RESOStandards/reso-upi/issues).

If you have code changes to contribute, fork the repo, clone locally, make the changes, and then make a PR against this repo.
