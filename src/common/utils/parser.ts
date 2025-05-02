import * as XLSX from 'xlsx';

export const parseExcel = (file: Express.Multer.File) => {
	const workbook = XLSX.read(file.buffer, { type: 'buffer' });
	const sheetName = workbook.SheetNames[0];
	const sheet = workbook.Sheets[sheetName];
	return XLSX.utils.sheet_to_json(sheet, { raw: false });
};
