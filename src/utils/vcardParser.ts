export interface ParsedVCard {
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string;
  org: string;
  title: string;
  url: string;
  address: string;
}

export const parseVCard = (vcardString: string): ParsedVCard => {
  const result: ParsedVCard = {
    firstName: '',
    lastName: '',
    fullName: '',
    phone: '',
    email: '',
    org: '',
    title: '',
    url: '',
    address: '',
  };

  const lines = vcardString.split('\n');

  for (const line of lines) {
    const cleanLine = line.trim();
    if (cleanLine.startsWith('N:')) {
      const parts = cleanLine.substring(2).split(';');
      result.lastName = parts[0] || '';
      result.firstName = parts[1] || '';
    } else if (cleanLine.startsWith('FN:')) {
      result.fullName = cleanLine.substring(3);
    } else if (cleanLine.startsWith('TEL')) {
      const parts = cleanLine.split(':');
      if (parts.length > 1) {
        result.phone = parts.slice(1).join(':');
      }
    } else if (cleanLine.startsWith('EMAIL')) {
      const parts = cleanLine.split(':');
      if (parts.length > 1) {
        result.email = parts.slice(1).join(':');
      }
    } else if (cleanLine.startsWith('ORG:')) {
      result.org = cleanLine.substring(4);
    } else if (cleanLine.startsWith('TITLE:')) {
      result.title = cleanLine.substring(6);
    } else if (cleanLine.startsWith('URL:')) {
      result.url = cleanLine.substring(4);
    } else if (cleanLine.startsWith('ADR:')) {
      // Basic ADR parsing. Usually: ADR:;;Street;City;State;Zip;Country
      const parts = cleanLine.substring(4).split(';');
      const addrParts = parts.filter(p => p.trim() !== '');
      result.address = addrParts.join(', ');
    }
  }

  return result;
};
