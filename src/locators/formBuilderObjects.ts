import { LocatorStrategy } from '../core/locatorStrategy';

export class FormBuilderLocators {
  readonly BUILDER_CARD = {
    strategy: LocatorStrategy.CSS,
    value: '.form-builder-page__card'
  };

  readonly QUESTION_CARDS = {
    strategy: LocatorStrategy.CSS,
    value: '.qcard'
  };

  readonly PREVIEW_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: '.fb-header button:has-text("Preview")'
  };

  readonly SAVE_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: '.fb-header button:has-text("Save")'
  };

  readonly PUBLISH_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: '.fb-header button:has-text("Publish")'
  };

  readonly CONFIRM_PUBLISH_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: '.app-modal button:has-text("Publish")'
  };

  readonly ADD_SECTION_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Add Sections")'
  };

  readonly PREVIEW_MODAL = {
    strategy: LocatorStrategy.CSS,
    value: '.fpm.show'
  };

  readonly APP_MODAL = {
    strategy: LocatorStrategy.CSS,
    value: '.app-modal'
  };

  // Shared ConfirmDialog (also used for the "Create New Version" fork prompt shown when
  // an already-published template is edited and re-published).
  readonly CONFIRM_DIALOG = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="confirm-dialog"]'
  };

  readonly CONFIRM_DIALOG_TITLE = {
    strategy: LocatorStrategy.CSS,
    value: '.confirm-dialog__title'
  };

  readonly CONFIRM_DIALOG_MESSAGE = {
    strategy: LocatorStrategy.CSS,
    value: '.confirm-dialog__message'
  };

  readonly CONFIRM_DIALOG_CONFIRM = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="confirm-dialog-confirm"]'
  };

  readonly NEW_VERSION_DIALOG_PATTERN = /new version/i;

  readonly QUESTION_TEXT_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'textarea.qrow__input'
  };

  readonly QUESTION_REQUIRED_LABEL = {
    strategy: LocatorStrategy.CSS,
    value: 'label.qcard__required'
  };

  readonly QUESTION_KEY_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'textarea.qcard__key-input'
  };

  // Per-card inline error ("Key must be unique") shown when a question key collides with another
  // (case-insensitive).
  readonly QUESTION_KEY_ERROR = {
    strategy: LocatorStrategy.CSS,
    value: 'span.qcard__key-error'
  };

  readonly SWITCH_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input[role="switch"]'
  };

  readonly SECTION_NAME_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: '.app-modal input[placeholder="e.g. Working hours"]'
  };

  readonly SAVE_SECTION_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: '.app-modal button:has-text("Save")'
  };

  readonly CANCEL_SECTION_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: '.app-modal button:has-text("Cancel")'
  };

  // Inline field error inside the section modal (e.g. "Section name is required").
  readonly SECTION_MODAL_ERROR = {
    strategy: LocatorStrategy.CSS,
    value: '.app-modal .text-error'
  };

  readonly SECTION_NAME_REQUIRED_TEXT = 'Section name is required';

  // Per-option "Remove option" delete button in the answer editor.
  readonly OPTION_REMOVE_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button.oer__remove'
  };

  // Visibility-logic button in its unset state (becomes "Edit logic" once a rule exists).
  readonly ADD_LOGIC_BUTTON_NAME = /Add logic/;

  readonly QUESTION_OPTION_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input.oer__input:not(.oer__input--value)'
  };

  readonly ADD_OPTION_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button.qae__add-option'
  };

  readonly PREVIEW_QUESTION = {
    strategy: LocatorStrategy.CSS,
    value: '.fpq'
  };

  readonly PREVIEW_REQUIRED_INDICATOR = {
    strategy: LocatorStrategy.CSS,
    value: 'span.text-danger, .required, .fpq__required'
  };

  readonly PREVIEW_COMMENT_AREA = {
    strategy: LocatorStrategy.CSS,
    value: 'textarea[placeholder="Add a comment (optional)"], .fpq__comment textarea'
  };

  readonly PREVIEW_SUBMIT_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button'
  };

  readonly PREVIEW_TEXT_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="Your answer"], input[placeholder="0"], textarea[placeholder="Your answer"], textarea'
  };

  readonly PREVIEW_FALLBACK_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input, textarea'
  };

  readonly PREVIEW_NUMBER_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="0"]'
  };

  readonly DATE_TRIGGER = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="date-field"] button.date-trigger'
  };

  readonly DATE_PICKER = {
    strategy: LocatorStrategy.CSS,
    value: '.dp__menu'
  };

  readonly DATE_YEAR_OVERLAY = {
    strategy: LocatorStrategy.CSS,
    value: '[data-dp-element="overlay-year"]'
  };

  readonly DATE_MONTH_OVERLAY = {
    strategy: LocatorStrategy.CSS,
    value: '[data-dp-element="overlay-month"]'
  };

  readonly DATE_OVERLAY_CELL = {
    strategy: LocatorStrategy.CSS,
    value: '.dp__overlay_cell'
  };

  readonly LOGIC_MODAL_FIELD = {
    strategy: LocatorStrategy.CSS,
    value: '.crow__field'
  };

  readonly LOGIC_VALUE_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="Value"], input[type="text"]'
  };

  readonly HELP_TEXT_INPUT = {
  strategy: LocatorStrategy.CSS,
  value: 'textarea[placeholder*="Optional guidance"]'
  };

  readonly CONFIRM_DELETE_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="confirm-dialog-confirm"]'
  };

  readonly PREVIEW_HELP_TEXT_ICON = {
  strategy: LocatorStrategy.CSS,
  value: '[data-testid="help-text-icon"], button[aria-label*="info"], .info-icon, svg[data-icon="info-circle"]'
  };

  readonly PREVIEW_HELP_TEXT_TOOLTIP = {
    strategy: LocatorStrategy.CSS,
    value: '[role="tooltip"], .tooltip, .popover, [data-testid="help-text-tooltip"]'
  };

  readonly DUPLICATE_QUESTION_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button[aria-label="Duplicate question"]'
  };

  readonly DELETE_QUESTION_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button[aria-label="Delete question"]'
  };

  readonly CONFIRM_DELETE_QUESTION_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="confirm-dialog-confirm"]'
  };

  readonly TAB_ACTIVE_CLASS = 'tab-control__tab--active';
  readonly ROLE_BUTTON = 'button';
  readonly ROLE_CHECKBOX = 'checkbox';
  readonly ROLE_OPTION = 'option';
  readonly ROLE_RADIO = 'radio';
  readonly ROLE_TAB = 'tab';
  readonly CLOSE_BUTTON_TEXT = 'Close';
  readonly NO_BUTTON_TEXT = 'No';
  readonly SUBMIT_BUTTON_TEXT = 'Submit';
  readonly SUBMITTED_HEADING_TEXT = 'Submitted';
  readonly SUBMITTED_MESSAGE_TEXT = 'Your form submitted successfully.';
  readonly YES_BUTTON_TEXT = 'Yes';
  readonly LOGIC_BUTTON_NAME = /Add logic|Edit logic/;
  readonly REQUIRED_RULE_BUTTON_NAME = /Add required rule|Edit required rule/;
  readonly REQUIRED_VALIDATION_TEXT = 'This field is required';
  readonly CHOOSE_QUESTION_NAME = /Choose question/i;
  readonly CHOOSE_OPTION_NAME = /Choose option/i;
  readonly SAVE_BUTTON_NAME = /Save/i;
  readonly SELECT_TRIGGER_TEXT = /--Select--|Choose option|Select/;
  readonly YES_BUTTON_NAME = /yes/i;
  readonly NO_BUTTON_NAME = /no/i;

  questionTypePaletteItem(typeLabel: string) {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//button[contains(@class,"qt-palette__item")][.//span[normalize-space()="${typeLabel}"]]`
    };
  }

  dateCellByValue(date: string) {
    return {
      strategy: LocatorStrategy.CSS,
      value: `[data-test-id="dp-${date}"]`
    };
  }

  // Matches the section's outer wrapper by its title text. The padded-space
  // "contains" check is needed because BEM modifier classes (e.g.
  // "form-section__header") also contain the plain "form-section" substring.
  sectionByName(name: string) {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//div[contains(concat(" ", normalize-space(@class), " "), " form-section ")][.//span[contains(concat(" ", normalize-space(@class), " "), " form-section__title ")][normalize-space()="${name}"]]`
    };
  }

  sectionDuplicateButton(name: string) {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `${this.sectionByName(name).value}//button[@aria-label="Duplicate section"]`
    };
  }

  sectionDeleteButton(name: string) {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `${this.sectionByName(name).value}//button[@aria-label="Delete section"]`
    };
  }

  // Renders as "N Question(s)" on the section header — used to compare a
  // duplicated section's question count against its source.
  sectionQuestionCountLabel(name: string) {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `${this.sectionByName(name).value}//span[contains(concat(" ", normalize-space(@class), " "), " form-section__count ")]`
    };
  }
}
