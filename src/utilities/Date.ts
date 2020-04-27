import { IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';

export const DayPickerStrings: IDatePickerStrings = {
    months: [
      'Januar',
      'Februar',
      'Marts',
      'April',
      'Maj',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'December',
    ],
  
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
  
    days: ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'],
  
    shortDays: ['S', 'M', 'T', 'O', 'T', 'F', 'L'],
  
    goToToday: 'Gå til idag',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',
    closeButtonAriaLabel: 'Close date picker',
  
    isRequiredErrorMessage: 'Field is required.',
  
    invalidInputErrorMessage: 'Invalid date format.',
  };

  export const onFormatDate = (date: Date | undefined): string => {
    if (date) {
      return date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear() % 100);
    }
    return "";
  };