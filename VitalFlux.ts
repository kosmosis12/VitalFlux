import type { Dimension, DateDimension, Attribute, DataSourceInfo } from '@sisense/sdk-data';

import { createAttribute, createDateDimension, createDimension } from '@sisense/sdk-data';

export const DataSource: DataSourceInfo = { title: 'VitalFlux', type: 'elasticube' };

interface vitalflux_adherence_daily_csvDimension extends Dimension {
    adherent_flag: Attribute;
    condition: Attribute;
    patient_id: Attribute;
    program: Attribute;
    region: Attribute;
    date: DateDimension;
}
export const vitalflux_adherence_daily_csv = createDimension({
    name: 'vitalflux_adherence_daily.csv',
    adherent_flag: createAttribute({
        name: 'adherent_flag',
        type: 'numeric-attribute',
        expression: '[vitalflux_adherence_daily.csv.adherent_flag]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    condition: createAttribute({
        name: 'condition',
        type: 'text-attribute',
        expression: '[vitalflux_adherence_daily.csv.condition]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    patient_id: createAttribute({
        name: 'patient_id',
        type: 'text-attribute',
        expression: '[vitalflux_adherence_daily.csv.patient_id]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    program: createAttribute({
        name: 'program',
        type: 'text-attribute',
        expression: '[vitalflux_adherence_daily.csv.program]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    region: createAttribute({
        name: 'region',
        type: 'text-attribute',
        expression: '[vitalflux_adherence_daily.csv.region]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    date: createDateDimension({
        name: 'date',
        expression: '[vitalflux_adherence_daily.csv.date (Calendar)]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
}) as vitalflux_adherence_daily_csvDimension;

interface vitalflux_cohort_outcomes_csvDimension extends Dimension {
    adherence_pct: Attribute;
    condition: Attribute;
    readmit_30d_pct: Attribute;
    region: Attribute;
    month: DateDimension;
}
export const vitalflux_cohort_outcomes_csv = createDimension({
    name: 'vitalflux_cohort_outcomes.csv',
    adherence_pct: createAttribute({
        name: 'adherence_pct',
        type: 'numeric-attribute',
        expression: '[vitalflux_cohort_outcomes.csv.adherence_pct]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    condition: createAttribute({
        name: 'condition',
        type: 'text-attribute',
        expression: '[vitalflux_cohort_outcomes.csv.condition]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    readmit_30d_pct: createAttribute({
        name: 'readmit_30d_pct',
        type: 'numeric-attribute',
        expression: '[vitalflux_cohort_outcomes.csv.readmit_30d_pct]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    region: createAttribute({
        name: 'region',
        type: 'text-attribute',
        expression: '[vitalflux_cohort_outcomes.csv.region]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    month: createDateDimension({
        name: 'month',
        expression: '[vitalflux_cohort_outcomes.csv.month (Calendar)]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
}) as vitalflux_cohort_outcomes_csvDimension;

interface vitalflux_cost_impact_csvDimension extends Dimension {
    baseline_readmit_pct: Attribute;
    current_readmit_pct: Attribute;
    est_cost_avoidance_usd: Attribute;
    program: Attribute;
    program_impact_proxy_pct: Attribute;
    quarter: Attribute;
    region: Attribute;
}
export const vitalflux_cost_impact_csv = createDimension({
    name: 'vitalflux_cost_impact.csv',
    baseline_readmit_pct: createAttribute({
        name: 'baseline_readmit_pct',
        type: 'numeric-attribute',
        expression: '[vitalflux_cost_impact.csv.baseline_readmit_pct]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    current_readmit_pct: createAttribute({
        name: 'current_readmit_pct',
        type: 'numeric-attribute',
        expression: '[vitalflux_cost_impact.csv.current_readmit_pct]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    est_cost_avoidance_usd: createAttribute({
        name: 'est_cost_avoidance_usd',
        type: 'numeric-attribute',
        expression: '[vitalflux_cost_impact.csv.est_cost_avoidance_usd]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    program: createAttribute({
        name: 'program',
        type: 'text-attribute',
        expression: '[vitalflux_cost_impact.csv.program]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    program_impact_proxy_pct: createAttribute({
        name: 'program_impact_proxy_pct',
        type: 'numeric-attribute',
        expression: '[vitalflux_cost_impact.csv.program_impact_proxy_pct]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    quarter: createAttribute({
        name: 'quarter',
        type: 'text-attribute',
        expression: '[vitalflux_cost_impact.csv.quarter]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    region: createAttribute({
        name: 'region',
        type: 'text-attribute',
        expression: '[vitalflux_cost_impact.csv.region]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
}) as vitalflux_cost_impact_csvDimension;

interface vitalflux_escalations_csvDimension extends Dimension {
    condition: Attribute;
    escalation_id: Attribute;
    patient_id: Attribute;
    program: Attribute;
    reason: Attribute;
    region: Attribute;
    resolved_flag: Attribute;
    severity: Attribute;
    date: DateDimension;
    resolved_date: DateDimension;
}
export const vitalflux_escalations_csv = createDimension({
    name: 'vitalflux_escalations.csv',
    condition: createAttribute({
        name: 'condition',
        type: 'text-attribute',
        expression: '[vitalflux_escalations.csv.condition]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    escalation_id: createAttribute({
        name: 'escalation_id',
        type: 'text-attribute',
        expression: '[vitalflux_escalations.csv.escalation_id]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    patient_id: createAttribute({
        name: 'patient_id',
        type: 'text-attribute',
        expression: '[vitalflux_escalations.csv.patient_id]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    program: createAttribute({
        name: 'program',
        type: 'text-attribute',
        expression: '[vitalflux_escalations.csv.program]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    reason: createAttribute({
        name: 'reason',
        type: 'text-attribute',
        expression: '[vitalflux_escalations.csv.reason]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    region: createAttribute({
        name: 'region',
        type: 'text-attribute',
        expression: '[vitalflux_escalations.csv.region]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    resolved_flag: createAttribute({
        name: 'resolved_flag',
        type: 'numeric-attribute',
        expression: '[vitalflux_escalations.csv.resolved_flag]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    severity: createAttribute({
        name: 'severity',
        type: 'text-attribute',
        expression: '[vitalflux_escalations.csv.severity]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    date: createDateDimension({
        name: 'date',
        expression: '[vitalflux_escalations.csv.date (Calendar)]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    resolved_date: createDateDimension({
        name: 'resolved_date',
        expression: '[vitalflux_escalations.csv.resolved_date (Calendar)]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
}) as vitalflux_escalations_csvDimension;

interface vitalflux_escalations_by_reason_monthly_csvDimension extends Dimension {
    count: Attribute;
    reason: Attribute;
    region: Attribute;
    month: DateDimension;
}
export const vitalflux_escalations_by_reason_monthly_csv = createDimension({
    name: 'vitalflux_escalations_by_reason_monthly.csv',
    count: createAttribute({
        name: 'count',
        type: 'numeric-attribute',
        expression: '[vitalflux_escalations_by_reason_monthly.csv.count]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    reason: createAttribute({
        name: 'reason',
        type: 'text-attribute',
        expression: '[vitalflux_escalations_by_reason_monthly.csv.reason]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    region: createAttribute({
        name: 'region',
        type: 'text-attribute',
        expression: '[vitalflux_escalations_by_reason_monthly.csv.region]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    month: createDateDimension({
        name: 'month',
        expression: '[vitalflux_escalations_by_reason_monthly.csv.month (Calendar)]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
}) as vitalflux_escalations_by_reason_monthly_csvDimension;

interface vitalflux_high_risk_patients_csvDimension extends Dimension {
    age_band: Attribute;
    condition: Attribute;
    device_model: Attribute;
    patient_id: Attribute;
    program: Attribute;
    region: Attribute;
    risk_score: Attribute;
    sex: Attribute;
}
export const vitalflux_high_risk_patients_csv = createDimension({
    name: 'vitalflux_high_risk_patients.csv',
    age_band: createAttribute({
        name: 'age_band',
        type: 'text-attribute',
        expression: '[vitalflux_high_risk_patients.csv.age_band]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    condition: createAttribute({
        name: 'condition',
        type: 'text-attribute',
        expression: '[vitalflux_high_risk_patients.csv.condition]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    device_model: createAttribute({
        name: 'device_model',
        type: 'text-attribute',
        expression: '[vitalflux_high_risk_patients.csv.device_model]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    patient_id: createAttribute({
        name: 'patient_id',
        type: 'text-attribute',
        expression: '[vitalflux_high_risk_patients.csv.patient_id]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    program: createAttribute({
        name: 'program',
        type: 'text-attribute',
        expression: '[vitalflux_high_risk_patients.csv.program]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    region: createAttribute({
        name: 'region',
        type: 'text-attribute',
        expression: '[vitalflux_high_risk_patients.csv.region]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    risk_score: createAttribute({
        name: 'risk_score',
        type: 'numeric-attribute',
        expression: '[vitalflux_high_risk_patients.csv.risk_score]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    sex: createAttribute({
        name: 'sex',
        type: 'text-attribute',
        expression: '[vitalflux_high_risk_patients.csv.sex]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
}) as vitalflux_high_risk_patients_csvDimension;

interface vitalflux_kpi_overview_csvDimension extends Dimension {
    active_patients: Attribute;
    avg_adherence_pct: Attribute;
    escalations_per_100: Attribute;
    month: Attribute;
    readmit_30d_pct: Attribute;
    region: Attribute;
}
export const vitalflux_kpi_overview_csv = createDimension({
    name: 'vitalflux_kpi_overview.csv',
    active_patients: createAttribute({
        name: 'active_patients',
        type: 'numeric-attribute',
        expression: '[vitalflux_kpi_overview.csv.active_patients]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    avg_adherence_pct: createAttribute({
        name: 'avg_adherence_pct',
        type: 'text-attribute',
        expression: '[vitalflux_kpi_overview.csv.avg_adherence_pct]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    escalations_per_100: createAttribute({
        name: 'escalations_per_100',
        type: 'numeric-attribute',
        expression: '[vitalflux_kpi_overview.csv.escalations_per_100]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    month: createAttribute({
        name: 'month',
        type: 'text-attribute',
        expression: '[vitalflux_kpi_overview.csv.month]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    readmit_30d_pct: createAttribute({
        name: 'readmit_30d_pct',
        type: 'text-attribute',
        expression: '[vitalflux_kpi_overview.csv.readmit_30d_pct]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    region: createAttribute({
        name: 'region',
        type: 'text-attribute',
        expression: '[vitalflux_kpi_overview.csv.region]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
}) as vitalflux_kpi_overview_csvDimension;

interface vitalflux_patients_csvDimension extends Dimension {
    active: Attribute;
    age_band: Attribute;
    condition: Attribute;
    device_model: Attribute;
    patient_id: Attribute;
    program: Attribute;
    region: Attribute;
    risk_band: Attribute;
    sex: Attribute;
    enrollment_date: DateDimension;
}
export const vitalflux_patients_csv = createDimension({
    name: 'vitalflux_patients.csv',
    active: createAttribute({
        name: 'active',
        type: 'text-attribute',
        expression: '[vitalflux_patients.csv.active]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    age_band: createAttribute({
        name: 'age_band',
        type: 'text-attribute',
        expression: '[vitalflux_patients.csv.age_band]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    condition: createAttribute({
        name: 'condition',
        type: 'text-attribute',
        expression: '[vitalflux_patients.csv.condition]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    device_model: createAttribute({
        name: 'device_model',
        type: 'text-attribute',
        expression: '[vitalflux_patients.csv.device_model]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    patient_id: createAttribute({
        name: 'patient_id',
        type: 'text-attribute',
        expression: '[vitalflux_patients.csv.patient_id]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    program: createAttribute({
        name: 'program',
        type: 'text-attribute',
        expression: '[vitalflux_patients.csv.program]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    region: createAttribute({
        name: 'region',
        type: 'text-attribute',
        expression: '[vitalflux_patients.csv.region]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    risk_band: createAttribute({
        name: 'risk_band',
        type: 'text-attribute',
        expression: '[vitalflux_patients.csv.risk_band]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    sex: createAttribute({
        name: 'sex',
        type: 'text-attribute',
        expression: '[vitalflux_patients.csv.sex]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    enrollment_date: createDateDimension({
        name: 'enrollment_date',
        expression: '[vitalflux_patients.csv.enrollment_date (Calendar)]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
}) as vitalflux_patients_csvDimension;

interface vitalflux_readmissions_csvDimension extends Dimension {
    condition: Attribute;
    encounter_id: Attribute;
    patient_id: Attribute;
    program: Attribute;
    readmitted_within_30d: Attribute;
    region: Attribute;
    index_discharge_date: DateDimension;
    readmit_date: DateDimension;
}
export const vitalflux_readmissions_csv = createDimension({
    name: 'vitalflux_readmissions.csv',
    condition: createAttribute({
        name: 'condition',
        type: 'text-attribute',
        expression: '[vitalflux_readmissions.csv.condition]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    encounter_id: createAttribute({
        name: 'encounter_id',
        type: 'text-attribute',
        expression: '[vitalflux_readmissions.csv.encounter_id]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    patient_id: createAttribute({
        name: 'patient_id',
        type: 'text-attribute',
        expression: '[vitalflux_readmissions.csv.patient_id]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    program: createAttribute({
        name: 'program',
        type: 'text-attribute',
        expression: '[vitalflux_readmissions.csv.program]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    readmitted_within_30d: createAttribute({
        name: 'readmitted_within_30d',
        type: 'numeric-attribute',
        expression: '[vitalflux_readmissions.csv.readmitted_within_30d]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    region: createAttribute({
        name: 'region',
        type: 'text-attribute',
        expression: '[vitalflux_readmissions.csv.region]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    index_discharge_date: createDateDimension({
        name: 'index_discharge_date',
        expression: '[vitalflux_readmissions.csv.index_discharge_date (Calendar)]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
    readmit_date: createDateDimension({
        name: 'readmit_date',
        expression: '[vitalflux_readmissions.csv.readmit_date (Calendar)]',
        dataSource: { title: 'VitalFlux', live: false },
    }),
}) as vitalflux_readmissions_csvDimension;
