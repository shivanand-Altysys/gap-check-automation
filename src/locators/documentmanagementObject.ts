import { LocatorStrategy } from '../core/locatorStrategy';
import { CSSLocator, RoleLocator } from '../types';

export class DocumentManagementLocators {

  // ============================================================
  // Document Management Listing
  // ============================================================

  readonly UPLOAD_DOCUMENT_BUTTON: RoleLocator = {
    strategy: LocatorStrategy.ROLE,
    role: 'button',
    value: 'Upload Document',
  };

  readonly TITLE_FILTER_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="Filter by title…"]',
  };

  documentRow(title: string): CSSLocator {
    return {
      strategy: LocatorStrategy.CSS,
      value: `tr:has-text("${title}")`,
    };
  }

  reviewButton(title: string): CSSLocator {
    return {
      strategy: LocatorStrategy.CSS,
      value: `tr:has-text("${title}") [aria-label="Open in Review Extraction Page"]`,
    };
  }

  
  deleteButtonByTitle(title: string): CSSLocator {
    return {
      strategy: LocatorStrategy.CSS,
      value: `tr:has-text("${title}") button[aria-label="Delete"]`,
    };
  }

  // ============================================================
  // Upload Document Page
  // ============================================================

  readonly TITLE_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="Enter Here"]',
  };

  readonly LANGUAGE_SELECT_TRIGGER: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button.select-trigger',
  };

  languageOption(language: string): CSSLocator {
    return {
      strategy: LocatorStrategy.CSS,
      value: `button[role="option"]:has-text("${language}")`,
    };
  }

  readonly FILE_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[type="file"]',
  };

  readonly SAVE_BUTTON: RoleLocator = {
    strategy: LocatorStrategy.ROLE,
    role: 'button',
    value: 'Save',
  };

  readonly CANCEL_BUTTON: RoleLocator = {
    strategy: LocatorStrategy.ROLE,
    role: 'button',
    value: 'Cancel',
  };

  // ============================================================
  // Upload Document Validation (DM_TC_003)
  // ============================================================

  // File-error markup is known exactly from UploadDocumentPage.vue:
  // <p v-if="sourceError" class="small text-danger m-0 mt-2">{{ sourceError }}</p>
  readonly FILE_ERROR_MESSAGE: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'p.small.text-danger',
  };

  // Title/Language errors are passed via :error-message prop into InputField
  // and SelectField — internal markup not confirmed. Falls back to a
  // text-scoped search within the upload card. Replace with a precise
  // selector once InputField.vue/SelectField.vue are available.
  validationMessage(message: string): CSSLocator {
    return {
      strategy: LocatorStrategy.CSS,
      value: `.upload-document-card:has-text("${message}")`,
    };
  }

  readonly TOAST_SUCCESS_UPLOAD: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.wi-toast-body:has-text("uploaded successfully")',
  };

  readonly TITLE_INPUT_INVALID: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="Enter Here"].is-invalid',
  };

  readonly LANGUAGE_SELECT_INVALID: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button.select-trigger.is-invalid',
  };

  // ============================================================
  // Review Extraction Page
  // ============================================================

  // readonly PDF_VIEWER: CSSLocator = {
  //   strategy: LocatorStrategy.CSS,
  //   value: '.pdf-viewer',
  // };
  // Scoped to .review-col-pdf: the fullscreen preview modal (FormPreviewModal)
  // is teleported to <body> and stays mounted (Bootstrap toggles display via
  // CSS, not v-if), so it renders a second, hidden .pdfjs-viewer whenever the
  // page is open — an unscoped selector hits Playwright's strict-mode check.
  readonly PDF_VIEWER: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.review-col-pdf .pdfjs-viewer',
  };

  // Scoped to .review-col-editor for the same reason as PDF_VIEWER above:
  // the always-mounted fullscreen preview modal renders its own hidden
  // summernote-editor (class="preview-editor") that would otherwise cause
  // a Playwright strict-mode violation.
  readonly HTML_EDITOR: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.review-col-editor [data-testid="summernote-editor"]',
  };

  readonly HTML_EDITOR_CONTENT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.review-col-editor [data-testid="summernote-editor"] .note-editable',
  };

  // Same .review-col-editor scoping as HTML_EDITOR above — the always-mounted
  // fullscreen preview modal has its own codeview button/textarea that would
  // otherwise cause a Playwright strict-mode violation.
  readonly CODE_VIEW_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.review-col-editor [data-testid="summernote-editor"] button.btn-codeview',
  };

  readonly CODE_VIEW_TEXTAREA: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.review-col-editor [data-testid="summernote-editor"] textarea.note-codable',
  };

  readonly EXTRACTION_ISSUES_PANEL: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.review-col-issues',
  };

  // IssueItem only renders its "Resolve" pill for the currently selected
  // row (v-if="isSelected"), so an issue must be clicked before this
  // resolves to anything.
  readonly ISSUE_ITEM_ROW: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.review-col-issues .issue-item',
  };

  // ProgressBar's label only renders once loadingIssues flips to false
  // (ReviewExtractionPage.vue) — a reliable "issues panel finished its
  // async load" signal, since a 0 .issue-item count during loading looks
  // identical to "no issues left" otherwise.
  readonly ISSUES_PROGRESS_LABEL: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.review-col-issues .progress-bar__label',
  };

  readonly PUBLISH_BUTTON: RoleLocator = {
    strategy: LocatorStrategy.ROLE,
    role: 'button',
    value: 'Publish',
  };

  // ============================================================
  // Publish Confirmation
  // ============================================================

  readonly CONFIRM_DIALOG: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="confirm-dialog"]',
  };

  readonly CONFIRM_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="confirm-dialog-confirm"]',
  };

  readonly CONFIRM_DELETE_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="confirm-dialog-confirm"]',
  };

  readonly RESOLVE_BUTTON: RoleLocator = {
  strategy: LocatorStrategy.ROLE,
  role: 'button',
  value: 'Resolve',
  };

  // ============================================================
  // Success Alert
  // ============================================================

  readonly ALERT_DIALOG: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="alert-dialog"]',
  };

  readonly ALERT_OK_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="alert-dialog-dismiss"]',
  };
}