export const initialAddressValues = {
  fullName: '',
  mobileNumber: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
};

export const addressFields = [
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    autoComplete: 'name',
    required: true,
  },
  {
    name: 'mobileNumber',
    label: 'Mobile Number',
    type: 'tel',
    autoComplete: 'tel',
    required: true,
  },
  {
    name: 'addressLine1',
    label: 'Address Line 1',
    type: 'text',
    autoComplete: 'address-line1',
    required: true,
  },
  {
    name: 'addressLine2',
    label: 'Address Line 2',
    type: 'text',
    autoComplete: 'address-line2',
    required: false,
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    autoComplete: 'address-level2',
    required: true,
  },
  {
    name: 'state',
    label: 'State',
    type: 'text',
    autoComplete: 'address-level1',
    required: true,
  },
  {
    name: 'pincode',
    label: 'Pincode',
    type: 'text',
    autoComplete: 'postal-code',
    required: true,
  },
];

export const validateAddress = (values) => {
  const errors = {};
  const mobilePattern = /^[6-9]\d{9}$/;
  const pincodePattern = /^\d{6}$/;

  addressFields.forEach((field) => {
    if (field.required && !values[field.name].trim()) {
      errors[field.name] = `${field.label} is required.`;
    }
  });

  if (values.mobileNumber && !mobilePattern.test(values.mobileNumber.trim())) {
    errors.mobileNumber = 'Enter a valid 10 digit mobile number.';
  }

  if (values.pincode && !pincodePattern.test(values.pincode.trim())) {
    errors.pincode = 'Enter a valid 6 digit pincode.';
  }

  return errors;
};

export const normalizeAddress = (values) =>
  Object.entries(values).reduce(
    (address, [key, value]) => ({
      ...address,
      [key]: value.trim(),
    }),
    {}
  );
