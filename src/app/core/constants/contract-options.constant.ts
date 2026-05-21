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