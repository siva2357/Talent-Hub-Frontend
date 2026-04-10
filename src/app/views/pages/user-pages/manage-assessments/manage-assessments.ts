import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Pagination } from "../../../components/pagination/pagination";
import { Table } from "../../../components/table/table";
import { Buttons } from "../../../components/buttons/buttons";
import { AssessmentService } from '../../../../core/services/assessment-service';


@Component({
  selector: 'app-manage-assessments',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Pagination, Table, Buttons],
  templateUrl: './manage-assessments.html',
  styleUrl: './manage-assessments.css',
})
export class ManageAssessments implements OnInit {
  public isEditMode!: boolean;

constructor(  private fb: FormBuilder, private assessmentService: AssessmentService ) {}

assessmentForm!: FormGroup;
minDate = new Date().toISOString().split('T')[0];
  columns: any[] = [];



  @ViewChild('statusTemplate', { static: true })
  public statusTemplateRef!: TemplateRef<any>;

  @ViewChild('actionsTemplate', { static: true })
  public actionsTemplateRef!: TemplateRef<any>;

  assessments: any[] = [];
paginatedAssessments: any[] = [];
filteredAssessments: any[] = [];

page = 1;
limit = 5;
total = 0;
isFiltering = false;
loading = false;


selectedAssessment: any;


ngOnInit() {
this.columns = [
  { name: 'S.NO', prop: 'sno' },
  { name: 'Job ID', prop:'jobId' },
  { name: 'Job Title', prop: 'jobTitle' },
  { name: 'Applicant Name', prop: 'jobSeekerName' },
  { name: 'Email', prop: 'email' },
  { name: 'Assessment Date', prop: 'scheduledDate' },
  { name: 'Status', template: this.statusTemplateRef },
  { name: 'Actions', template: this.actionsTemplateRef, center: true },
];


  this.loadAssessments();
  this.initForm();
}

initForm() {
  this.assessmentForm = this.fb.group({
    _id: [''],

    jobPostId: [''],
    jobSeekerId: [''],

    assessmentLink: ['', Validators.required],
    dueDate: ['', Validators.required],
    description: [''],

    status: ['Assigned']
  });
}

loadAssessments() {
  this.loading = true;

  this.assessmentService.getRecruiterAssessments().subscribe({
    next: (res: any) => {

      // ✅ FIX: correct extraction + mapping
      this.assessments = (res.assessments || []).map((a: any) => ({
        ...a,
        jobSeekerName: a.name,
        scheduledDate: a.dueDate,
        meetingJoinUrl: a.assessmentLink
      }));

      this.total = res.total || 0;

      this.applyPagination();
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}


applyPagination() {
  const source =
    this.filteredAssessments.length || this.isFiltering
      ? this.filteredAssessments
      : this.assessments;

  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;

  this.paginatedAssessments = source.slice(start, end).map((item, index) => ({
    ...item,
    sno: start + index + 1
  }));
}


onPageChange(p: number) {
  this.page = p;
  this.applyPagination();
}

onLimitChange(l: number) {
  this.limit = l;
  this.page = 1;
  this.applyPagination();
}




selectAssessment(assessment: any) {
  this.isEditMode = true;

  this.selectedAssessment = assessment;

  this.assessmentForm.patchValue({
    _id: assessment._id,
    jobPostId: assessment.jobPostId,
    jobSeekerId: assessment.jobSeekerId,
    assessmentLink: assessment.assessmentLink,
    dueDate: this.formatDate(assessment.dueDate),
    description: assessment.description,
    status: assessment.status
  });
}


formatDate(date: string) {
  return new Date(date).toISOString().split('T')[0];
}



saveAssessment() {

  if (this.assessmentForm.invalid) {
    this.assessmentForm.markAllAsTouched();
    return;
  }

  const form = this.assessmentForm.value;

  const payload = {
    jobPostId: form.jobPostId,
    jobSeekerId: form.jobSeekerId,
    assessmentLink: form.assessmentLink,
    dueDate: form.dueDate,
    description: form.description
  };

  if (this.isEditMode && form._id) {
    this.assessmentService.updateAssessment(form._id, payload).subscribe({
      next: () => {
        this.loadAssessments();
        this.resetForm();
      },
      error: (err) => console.error(err)
    });
  }
}


resetForm() {
  this.isEditMode = false;
  this.assessmentForm.reset({
    status: 'Assigned'
  });
}

openDeleteModal(assessment: any) {
  this.selectedAssessment = assessment;
}

confirmDelete() {
  if (!this.selectedAssessment?._id) return;

  this.assessmentService.deleteAssessment(this.selectedAssessment._id).subscribe({
    next: (res: any) => {
      console.log(res.message);

      this.loadAssessments(); // refresh

      const modal = document.getElementById('deleteAssessmentModal');
      if (modal) {
        (window as any).bootstrap.Modal.getInstance(modal)?.hide();
      }

      this.selectedAssessment = null;
    },
    error: (err) => console.error(err)
  });
}

}
