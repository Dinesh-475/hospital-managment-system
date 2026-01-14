// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (strict mobile format: 10-15 digits, optional +)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
};

// Name validation
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};

// OTP validation
export const isValidOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

// Employee ID validation
export const isValidEmployeeId = (id: string): boolean => {
  return /^[A-Z]{3}\d{3,}$/.test(id);
};

// Blood group validation
export const isValidBloodGroup = (bloodGroup: string): boolean => {
  const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validGroups.includes(bloodGroup);
};

// Age validation
export const isValidAge = (age: number): boolean => {
  return age > 0 && age < 150;
};

// Form field validators with error messages
export const validators = {
  email: (value: string): string | null => {
    if (!value) return 'Email is required';
    if (!isValidEmail(value)) return 'Please enter a valid email address';
    return null;
  },
  
  phone: (value: string): string | null => {
    if (!value) return 'Phone number is required';
    if (!isValidPhone(value)) return 'Please enter a valid phone number';
    return null;
  },
  
  name: (value: string): string | null => {
    if (!value) return 'Name is required';
    if (!isValidName(value)) return 'Name must contain only letters and spaces';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return null;
  },
  
  otp: (value: string): string | null => {
    if (!value) return 'OTP is required';
    if (!isValidOTP(value)) return 'OTP must be 6 digits';
    return null;
  },
  
  employeeId: (value: string): string | null => {
    if (!value) return 'Employee ID is required';
    if (!isValidEmployeeId(value)) return 'Invalid format (e.g., DOC001)';
    return null;
  },
  
  bloodGroup: (value: string): string | null => {
    if (!value) return 'Blood group is required';
    if (!isValidBloodGroup(value)) return 'Invalid blood group';
    return null;
  },
  
  age: (value: number): string | null => {
    if (!value) return 'Age is required';
    if (!isValidAge(value)) return 'Please enter a valid age';
    return null;
  },
  
  required: (value: any): string | null => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  }
};

// Debounce function for input validation
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
