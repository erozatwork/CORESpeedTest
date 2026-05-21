const fileData = (filename, type) => ({
    path: `./${filename}`,
    relativePath: `./${filename}`,
    name: filename,
    type,
    size: Math.floor(Math.random() * 1_000_000), // simulate file size
    lastModified: Date.now() - Math.floor(Math.random() * 100000000),
    webkitRelativePath: ''
});

const commonData = [
    {
        "prerequisite": [
            {
                nbi_clearance: [
                    fileData('NBI Clearance.pdf', 'application/pdf'),                    
                    fileData('Police Clearance.pdf', 'application/pdf'),                    
                    fileData('Barangay Clearance.pdf', 'application/pdf'),                    
                ],
                psa_birth_certificate: [
                    fileData('PSA.pdf', 'application/pdf'),                  
                ],
                pre_employment_med_exam: [
                    fileData('med_exam.pdf', 'application/pdf'),                  
                ]
            },
        ],
    },
    {
        "general_requirements": [
            {
                pagibig_mid: [fileData('PagIBIG.pdf', 'application/pdf')],
                philhealth: [fileData('PhilHealth.pdf', 'application/pdf')],
                tin: [fileData('TIN.pdf', 'application/pdf')],
                sss: [fileData('SSS.pdf', 'application/pdf')],
                educational_attainment: [fileData('Diploma.pdf', 'application/pdf')],
                psa_marriage_certificate: [fileData('MarriageCertificate.pdf', 'application/pdf')],
                dependent_birth_certificates: [fileData('DependentBirthCert.pdf', 'application/pdf')],
                clearance: [fileData('COE_Clearance.pdf', 'application/pdf')],
                bir_2316: [fileData('BIR2316.pdf', 'application/pdf')],
            }
        ]
    }
];

export const OnboardingRequirements = commonData.map((data, index) => {
  return { data };
});
