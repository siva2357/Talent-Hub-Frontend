import { Attachment } from "../model/contract-diary.model";


export interface AddPhaseFormDto {

  name: string;

  description: string;

  deadline: string;

  amount: number | null;

  clientAttachments: Attachment[];

}