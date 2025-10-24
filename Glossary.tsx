import React from 'react';

const glossaryTerms = [
    { term: 'RPM', definition: 'Remote Patient Monitoring. A healthcare delivery method that uses technology to monitor patient health outside of a traditional clinical setting.' },
    { term: 'CCM', definition: 'Chronic Care Management. A specific care management service for patients with two or more chronic conditions, focusing on coordination of care between providers.' },
    { term: 'CHF', definition: 'Congestive Heart Failure. A chronic condition in which the heart doesn\'t pump blood as well as it should.' },
    { term: 'HTN', definition: 'Hypertension. Commonly known as high blood pressure, a condition where the long-term force of the blood against artery walls is high enough that it may eventually cause health problems.' },
    { term: 'T2D', definition: 'Type 2 Diabetes. A chronic condition that affects the way the body processes blood sugar (glucose).' },
    { term: 'Adherence', definition: 'The extent to which a patient follows their prescribed treatment plan, including medication, diet, and device usage. High adherence is critical for positive health outcomes.' },
    { term: 'Readmission', definition: 'When a patient is admitted to a hospital again within a short period (typically 30 days) after being discharged. Reducing readmission rates is a key goal for healthcare providers.' },
    { term: 'Escalation', definition: 'A process where a patient\'s data (e.g., a vital sign reading) triggers a clinical alert that requires review or intervention from a healthcare professional.' },
    { term: 'Cohort', definition: 'A group of patients who share a common characteristic, such as a specific medical condition, treatment plan, or demographic feature, used for analysis and comparison.' },
    { term: 'PHI', definition: 'Protected Health Information. Any information in a medical record that can be used to identify an individual, and that was created, used, or disclosed in the course of providing a health care service, as defined by HIPAA.' },
];

const Glossary: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Glossary of Terms</h1>
            <div className="space-y-4">
                {glossaryTerms.map(({ term, definition }) => (
                    <div key={term} className="bg-stone-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h2 className="text-xl font-semibold text-primary-500">{term}</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{definition}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Glossary;
