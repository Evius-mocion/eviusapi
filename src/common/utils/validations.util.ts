import { DynamicField } from "src/types/event.type";


export const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export function validateEmail(email: string): boolean {
    return REGEX_EMAIL.test(email);
  }

  type Attendee = {
    email?: string;
    fullName?: string;
    [key: string]: any; // Permite otras propiedades opcionales
  };
  
 export function validateAttendeesData(attendee: Attendee, dinamicData: DynamicField[]): { isValid: boolean; errors: string[] } {
    const errors = []
    const { email, fullName , ...others} = attendee;

    if (!validateEmail(email)) {
      errors.push('Invalid email');
    }
    if (!fullName || fullName.trim() === '') {
      errors.push('Full name is required');
    }
      
    if (Object.keys(others).length) {
      dinamicData.forEach((field) => {
        if (field.isRequerid && !others[field.name] && others[field.name]?.trim() === '') {
          errors.push(`Field ${field.name} is required`);
        }
  
        if(field.type === 'number' && isNaN(others[field.name])){
          errors.push(`Field ${field.name} must be a number`);
        }
  
      });
    }

    return {
      isValid : errors.length === 0,
      errors,
    };
  }
