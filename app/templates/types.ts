// Base interfaces
interface PositionBase {
    text: string;
    application_contact_url?: string;
    application_contact_email?: string;
    application_contact_phone?: string;
    salary?: string;
}

interface SpecificationBase {
    application_deadline?: string;
    location?: string;
    education_level?: string;
    major?: string;
    experience_level?: string;
    date_published?: string;
    job_type?: string;
    work_arrangement?: string;
    industry?: string;
    gender?: string;
    age?: string;
}

interface JobPostingBase {
    job_url: string;
    company_name?: string;
    description?: string;
    image?: string;
    last_modified?: string;
    number_of_vacancies?: number;
}

interface JobProviderBase {
    name: string;
    base_url: string;
    description?: string;
    is_active: boolean;
    is_syncing: boolean;
    last_synced_at?: Date;
}

// Main entity interfaces with relationships
interface Specification extends SpecificationBase {
    id: string;
    job_posting_id?: string;
    job_posting?: JobPosting;
}

interface Position extends PositionBase {
    id: string;
    job_posting_id?: string;
    job_posting?: JobPosting;
}

interface JobProvider extends JobProviderBase {
    id: string;
    job_postings: JobPosting[];
    created_at: Date;
    updated_at: Date;
}

interface JobPosting extends JobPostingBase {
    id: string;
    job_provider_id: string;
    provider: JobProvider;
    positions: Position[];
    specification?: Specification;
    created_at: Date;
    updated_at: Date;
}

interface DatabaseSchema {
    Specification: Specification;
    Position: Position;
    JobProvider: JobProvider;
    JobPosting: JobPosting;
    PositionBase: PositionBase;
    SpecificationBase: SpecificationBase;
    JobPostingBase: JobPostingBase;
    JobProviderBase: JobProviderBase;
}

interface MergedJobSchema extends JobPostingBase, JobProviderBase, PositionBase, SpecificationBase {
    id: string;
    job_provider_id: string;
    created_at: Date;
    updated_at: Date;

    provider: JobProvider;
    positions: Position[];
    specification?: Specification;
    job_postings: JobPosting[];

    job_posting_id?: string;
}

interface TApiResponse<T = undefined> {
    data: T,
    message: string,
    success: boolean
}

export type {
    DatabaseSchema,
    MergedJobSchema,
    Specification,
    Position,
    JobProvider,
    JobPosting,
    SpecificationBase,
    PositionBase,
    JobPostingBase,
    JobProviderBase,
    TApiResponse
};