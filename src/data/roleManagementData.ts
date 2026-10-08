import { GroupData, RoleData } from '../types';

export const DefaultRoleTemplate: Partial<RoleData> = {
  description: 'Automation role created for role-group user assignment coverage',
};

export const DefaultGroupTemplate: Partial<GroupData> = {
  domain: 'Survey Engine',
  country: 'Global',
};
