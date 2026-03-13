export type country = {
    flags: {
        png: string;
    };
    name: {
        common: string;
    };
    population: number;
    languages: string;
    region: string;
    currencies: Currency[];
    area: number;
    capital: string;
};

export type Currency = {
    name: string;
    sign: string;
}

// {
//     "flags": {
//         "png": "https://flagcdn.com/w320/zw.png",
//         "svg": "https://flagcdn.com/zw.svg",
//         "alt": "The flag of Zimbabwe is composed of seven equal horizontal bands of green, yellow, red, black, red, yellow and green, with a white isosceles triangle superimposed on the hoist side of the field. This triangle is edged in black, spans about one-fourth the width of the field and has its base on the hoist end. A yellow Zimbabwe Bird superimposed on a five-pointed red star is centered in the triangle."
//     },
//     "name": {
//         "common": "Zimbabwe",
//         "official": "Republic of Zimbabwe",
//         "nativeName": {
//             "bwg": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             },
//             "eng": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             },
//             "kck": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             },
//             "khi": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             },
//             "ndc": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             },
//             "nde": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             },
//             "nya": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             },
//             "sna": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             },
//             "sot": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             },
//             "toi": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             },
//             "tsn": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             },
//             "tso": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             },
//             "ven": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             },
//             "xho": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             },
//             "zib": {
//                 "official": "Republic of Zimbabwe",
//                 "common": "Zimbabwe"
//             }
//         }
//     },
//     "currencies": {
//         "ZWL": {
//             "name": "Zimbabwean dollar",
//             "symbol": "$"
//         }
//     },
//     "languages": {
//         "bwg": "Chibarwe",
//         "eng": "English",
//         "kck": "Kalanga",
//         "khi": "Khoisan",
//         "ndc": "Ndau",
//         "nde": "Northern Ndebele",
//         "nya": "Chewa",
//         "sna": "Shona",
//         "sot": "Sotho",
//         "toi": "Tonga",
//         "tsn": "Tswana",
//         "tso": "Tsonga",
//         "ven": "Venda",
//         "xho": "Xhosa",
//         "zib": "Zimbabwean Sign Language"
//     },
//     "cca3": "ZWE",
//     "capital": [
//         "Harare"
//     ],
//     "region": "Africa",
//     "borders": [
//         "BWA",
//         "MOZ",
//         "ZAF",
//         "ZMB"
//     ],
//     "area": 390757,
//     "population": 17073087
// }