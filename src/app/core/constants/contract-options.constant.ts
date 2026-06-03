import {
  ContractStatusEnum,
  BudgetTypeEnum
} from '../enums/contract.enum';

export const CONTRACT_STATUS_OPTIONS = [

  {
    label: 'Pending',
    value: ContractStatusEnum.PENDING
  },

  {
    label: 'In Progress',
    value: ContractStatusEnum.IN_PROGRESS
  },

  {
    label: 'Completed',
    value: ContractStatusEnum.COMPLETED
  }

];

export const BUDGET_TYPE_OPTIONS = [

  {
    label: 'Fixed Price',
    value: BudgetTypeEnum.FIXED_PRICE
  },

  {
    label: 'Hourly Rate',
    value: BudgetTypeEnum.HOURLY_RATE
  }

];

export const CONTRACT_TYPE_OPTIONS = [
  { label: 'Frontend', value: 'Frontend' },
  { label: 'Backend', value: 'Backend' },
  { label: 'Fullstack', value: 'Fullstack' },
  { label: 'Mobile Dev', value: 'Mobile Dev' }
];

export const CONTRACT_SUBJECT_OPTIONS = [
  { label: 'Fintech', value: 'Fintech' },
  { label: 'Enterprise', value: 'Enterprise' },
  { label: 'E-Commerce', value: 'E-Commerce' },
  { label: 'Healthcare', value: 'Healthcare' },
  { label: 'Edtech', value: 'Edtech' },
  { label: 'Social Media', value: 'Social Media' },
  { label: 'Other', value: 'Other' }
];