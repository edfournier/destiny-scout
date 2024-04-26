const vendorMap = {
    "2190858386": "Xûr",
    "672118013": "Banshee-44",
    "350061650": "Ada-1",
}

export function getVendorName(hash) {
    return vendorMap[hash];
}