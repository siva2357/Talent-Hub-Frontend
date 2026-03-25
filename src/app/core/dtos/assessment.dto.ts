export interface CreateAssessmentDTO {
  jobPostId: string;
  jobSeekerId: string;
  assessmentLink: string;
  dueDate:Date;
  description:string;
}


export interface UpdateAssessmentDTO {
  assessmentLink: string;
}
