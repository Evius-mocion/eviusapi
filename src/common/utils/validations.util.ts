

export const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export function validateEmail(password: string): boolean {
    return REGEX_EMAIL.test(password);
  }

  type Attendee = {
    email?: string;
    fullName?: string;
    [key: string]: any; // Permite otras propiedades opcionales
  };
  
 export function validateAttendeesData(attendees: Attendee[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
  
    attendees.forEach((attendee, index) => {
      if (!attendee.email || typeof attendee.email !== 'string') {
        errors.push(`Error en el asistente ${index + 1}: 'email' es obligatorio y debe ser un string.`);
      }
      if (!attendee.fullName || typeof attendee.fullName !== 'string') {
        errors.push(`Error en el asistente ${index + 1}: 'fullName' es obligatorio y debe ser un string.`);
      }
    });
  
    return {
      valid: errors.length === 0,
      errors,
    };
  }
  