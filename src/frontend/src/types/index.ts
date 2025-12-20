export interface University {
    _id: string;
    key: string;
    name: string;
    color: string;
}

export interface College {
    _id: string;
    key: string;
    name: string;
    universityKey: string;
}

export interface StudyInfo {
    duration_years?: number;
    degree_type?: string;
    language?: string;
    credit_hours?: number;
    credit_hour_price?: number;
    tuition_fees?: number;
}

export interface AdmissionRequirements {
    min_gpa?: number;
    admission_test?: boolean;
    required_subjects?: string[];
}

export interface Major {
    _id: string;
    name: string;
    universityKey: string;
    collegeKey: string;
    description?: string;
    plan_url?: string;
    study_info?: StudyInfo;
    admission_requirements?: AdmissionRequirements;
}
