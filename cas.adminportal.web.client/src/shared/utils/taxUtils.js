/**
 * Tax Computation Utility for VAT & EWT
 * 
 * Supports:
 * - VAT Exclusive: Price is NET of VAT. VAT = Price * RowRate. EWT = Price * EwtRate.
 * - VAT Inclusive: Price is GROSS. Net = Price / (1 + RowRate). VAT = Net * RowRate. EWT = Net * EwtRate.
 * - Out of Scope: No VAT applied.
 */

export const parseTaxRate = (tax) => {
    if (tax === undefined || tax === null) return 0;
    const sTax = String(tax).toUpperCase();
    const nTax = Number(tax);

    if (nTax === 1 || nTax === 2 || nTax === 4 || nTax === 5 || sTax.includes("12% VAT") || sTax.includes("VAT - 12%")) return 0.12;
    if (nTax === 3 || nTax === 6 || nTax === 7 || sTax.includes("EXEMPT") || sTax.includes("ZERO") || sTax.includes("NO VAT")) return 0;

    const match = sTax.match(/(\d+)%/);
    if (match) return parseFloat(match[1]) / 100;

    const num = parseFloat(sTax.replace("%", ""));
    return isNaN(num) ? 0 : num / 100;
};

export const parseEwtRate = (ewt) => {
    if (ewt === undefined || ewt === null) return 0;
    const sEwt = String(ewt).toUpperCase();
    const nEwt = Number(ewt);

    // Mandatory Finance Mapping: 1% Goods, 2% Service, 5% Rent
    if (nEwt === 4 || sEwt.includes("1%") || sEwt.includes("GOODS")) return 0.01;
    if (nEwt === 3 || sEwt.includes("2%") || sEwt.includes("SERVICE")) return 0.02;
    if (nEwt === 2 || sEwt.includes("5%") || sEwt.includes("RENT")) return 0.05;
    
    if (nEwt === 1 || sEwt.includes("NONE")) return 0;

    const match = sEwt.match(/(\d+)%/);
    if (match) return parseFloat(match[1]) / 100;
    
    // If it's a decimal already (e.g. 0.01)
    const val = parseFloat(sEwt);
    if (val > 0 && val < 1) return val;

    return 0;
};

export const computeLineItem = (item, taxType = 1) => {
    const qty = parseFloat(item.qty || item.Qty) || 0;
    const price = parseFloat(item.unitPrice || item.UnitPrice) || 0;
    const lineAmount = qty * price;
    
    // Handle both camelCase and PascalCase from various API responses
    const taxVal = item.taxTypeId ?? item.TaxTypeId ?? item.taxType ?? item.TaxType ?? item.tax ?? item.Tax;
    const ewtVal = item.withholdingTaxTypeId ?? item.WithholdingTaxTypeId ?? item.ewtTypeId ?? item.EwtTypeId ?? item.ewtType ?? item.EwtType ?? item.ewt ?? item.Ewt;

    const vatRate = parseTaxRate(taxVal);
    const ewtRate = parseEwtRate(ewtVal);

    let lineNet = 0;
    let lineVat = 0;
    let lineEwt = 0;
    let lineAmountDisplay = 0; // Column "AMOUNT"
    let lineTotalDisplay = 0;  // Column "TOTAL"

    const sTaxType = String(taxType || "").toUpperCase();
    const isExclusive = taxType === 1 || sTaxType.includes("EXCLUSIVE");
    const isInclusive = taxType === 2 || sTaxType.includes("INCLUSIVE");

    if (isExclusive) {
        lineNet = lineAmount;
        lineVat = lineNet * vatRate;
        lineEwt = lineNet * ewtRate;
        lineAmountDisplay = lineAmount; // DISPLAY AS NET
        lineTotalDisplay = lineAmount + lineVat; // DISPLAY AS GROSS
    } else if (isInclusive) {
        // Rule: AMOUNT is Gross, TOTAL is Net (extracted)
        const lineGross = lineAmount;
        // Extraction formula: Net = Gross / (1 + vatRate)
        lineNet = lineGross / (1 + vatRate); 
        lineVat = lineGross - lineNet;
        lineEwt = lineNet * ewtRate;
        lineAmountDisplay = lineAmount; // Display Gross
        lineTotalDisplay = lineNet;   // Display Net
    } else {
        lineNet = lineAmount;
        lineVat = 0;
        lineEwt = 0;
        lineAmountDisplay = lineAmount;
        lineTotalDisplay = lineAmount;
    }

    return {
        qty,
        unitPrice: price,
        net: lineNet,
        vat: lineVat,
        ewt: lineEwt,
        amount: lineAmountDisplay,
        total: lineTotalDisplay,
        gross: isInclusive ? lineAmount : (lineAmount + lineVat),
        ewtRate,
        vatRate,
        taxType: taxVal
    };
};

export const computeTotals = (items = [], taxType = 1) => {
    let totalNet = 0;
    let totalVat = 0;
    let totalEwt = 0;
    let totalGross = 0;

    (items || []).forEach((item) => {
        const line = computeLineItem(item, taxType);
        totalNet += line.net;
        totalVat += line.vat;
        totalEwt += line.ewt;
        totalGross += line.gross;
    });

    const sType = String(taxType || "").toUpperCase();
    const isInclusive = sType.includes("INCLUSIVE") || Number(taxType) === 2;
    const isOutOfScope = sType.includes("OUT OF SCOPE") || Number(taxType) === 3;

    // Standard Rounding to 2 decimal places at the final step
    const subtotalResult = Math.round(totalNet * 100) / 100;
    const vatAmountResult = isOutOfScope ? 0 : Math.round(totalVat * 100) / 100;
    const ewtAmountResult = Math.round(totalEwt * 100) / 100;
    const grossAmountResult = Math.round(totalGross * 100) / 100;

    // GRAND TOTAL = GROSS - EWT (Common rule for both Inclusive and Exclusive)
    const grandTotal = Math.round((grossAmountResult - ewtAmountResult) * 100) / 100;

    return {
        subtotal: isInclusive ? subtotalResult : subtotalResult, // Both sum of net
        netOfVat: subtotalResult,
        vat: vatAmountResult,
        ewt: ewtAmountResult,
        total: grandTotal,
        grossAmount: grossAmountResult
    };
};

export const formatCurrency = (val) =>
    `₱${(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const getVatLabel = (taxType) => {
    const sType = String(taxType || "").toUpperCase();
    if (sType.includes("OUT OF SCOPE") || taxType === 3) return "VAT (Out of Scope)";
    if (sType.includes("INCLUSIVE") || taxType === 2) return "VAT Inclusive";
    return "VAT";
};

/**
 * Returns a specific label for the Tax column based on item properties
 */
export const getTaxTypeLabel = (item) => {
    const taxVal = item.taxTypeId ?? item.TaxTypeId ?? item.taxType ?? item.TaxType ?? item.tax ?? item.Tax;
    const sTax = String(taxVal || "").toUpperCase();
    const nTax = Number(taxVal);

    if (nTax === 3 || nTax === 6 || nTax === 7 || sTax.includes("EXEMPT")) return "VAT Exempt";
    if (nTax === 2 || nTax === 5 || sTax.includes("SERVICE")) return "12% VAT - Services";
    if (nTax === 1 || nTax === 4 || sTax.includes("GOODS")) return "12% VAT - Goods";
    if (sTax.includes("12% VAT")) return "12% VAT";
    return "None";
};

