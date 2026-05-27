/**
 * Represents a single leaf link inside a dropdown menu group.
 */
export interface NavSubItem {
  label: string;
  description: string;
  icon: string;
  route: string;
  queryParams?: any;
}

/**
 * Represents a top-level dropdown group in the navbar.
 * roles: which user roles can see this menu group.
 * activePaths: used to highlight the parent item when a sub-route is active.
 */
export interface NavMenuItem {
  label: string;
  roles: string;
  activePaths: string[];
  subItems: NavSubItem[];
}
