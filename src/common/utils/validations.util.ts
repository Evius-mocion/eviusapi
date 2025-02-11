import { DynamicField } from "src/types/event.type";


export const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

type Attendee = {
  email?: string;
  fullName?: string;
  [key: string]: any; // Permite otras propiedades opcionales
};

/**
 * function to validate an email
 * 
 * @param email  email to validate
 * @returns  boolean
 */
export function validateEmail(email: string): boolean {
    return REGEX_EMAIL.test(email);
  }
  /**
   * function to validate the data of the attendees,
   * comparee the data of the attendees with the dynamic fields of the event
   * 
   * @param attendee  attendee data
   * @param dinamicData  event registration fields
   * @returns  isValid: boolean, errors: string[] 
   */
 export function validateAttendeesData(attendee: Attendee, dinamicData: DynamicField[]): { isValid: boolean; errors: string[] } {
    const errors = []

    if (!validateEmail(attendee.email)) {
      errors.push('Invalid email');
    }
    if (!attendee.fullName || attendee.fullName.trim() === '') {
      errors.push('Full name is required');
    }
    
    dinamicData.forEach((field) => {
        if (field.isRequerid && !attendee[field.name] && attendee[field.name]?.trim() === '') {
          errors.push(`Field ${field.name} is required`);
        }
  
        if(field.type === 'number' && isNaN(attendee[field.name])){
          errors.push(`Field ${field.name} must be a number`);
        }
  
      });
    

    return {
      isValid : errors.length === 0,
      errors,
    };
  }
