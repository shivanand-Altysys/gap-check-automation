import { LocatorStrategy } from '../core/locatorStrategy';

export class SidebarLocators {
  // Main nav items
    readonly DASHBOARD_NAV = {
    strategy: LocatorStrategy.CSS,
    value: 'span.nav-label:text("Dashboard")'
    };

  readonly USER_ROLE_NAV = {
    strategy: LocatorStrategy.CSS,
    value: 'span.nav-label:text("User Role & Administration")'
  };

  readonly AUDIT_LOG_NAV = {
  strategy: LocatorStrategy.CSS,
  value: 'button.sidebar-submenu-item:has-text("Audit Log")'
};

  readonly OTHERS_NAV = {
    strategy: LocatorStrategy.CSS,
    value: 'button.sidebar-nav-item:has-text("Others")'
  };

  readonly COUNTRY_MANAGEMENT_NAV = {
    strategy: LocatorStrategy.TEXT,
    value: 'Country Management'
  };

  readonly SURVEY_ENGINE_NAV = {
    strategy: LocatorStrategy.CSS,
    value: 'button.sidebar-nav-item:has(span.nav-label:text("Survey Engine"))'
  };

  // Submenu items (visible after clicking User Role & Administration)
  readonly USER_MANAGEMENT_SUBMENU = {
    strategy: LocatorStrategy.CSS,
    value: 'button.sidebar-submenu-item:has-text("User Management")'
  };

  readonly ROLE_MANAGEMENT_SUBMENU = {
    strategy: LocatorStrategy.CSS,
    value: 'button.sidebar-submenu-item:has-text("Role Management")'
  };

  readonly GROUP_MANAGEMENT_SUBMENU = {
    strategy: LocatorStrategy.CSS,
    value: 'button.sidebar-submenu-item:has-text("Group Management")'
  };

  readonly DOCUMENT_MANAGEMENT_NAV = {
    strategy: LocatorStrategy.CSS,
    value: 'button.sidebar-nav-item:has(span.nav-label:text("Document Management"))'
  };

  // Active state check
  readonly ACTIVE_NAV_ITEM = {
    strategy: LocatorStrategy.CSS,
    value: 'button.sidebar-nav-item.is-active'
  };
}
