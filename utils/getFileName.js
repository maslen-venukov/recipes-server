import * as uuid from 'uuid';

const getFileName = img => {
  try {
    if(!img.mimetype.includes('image'))
      return res.status(400).json({ message: 'Неверный формат файла' });

    if(img.size > 1024 ** 2 * 5)
      return res.status(400).json({ message: 'Слишком большой размер файла' });

    const fileNameArr = img.name.split('.');
    const ext = fileNameArr[fileNameArr.length - 1];

    const fileName = uuid.v4() + '.' + ext;
    return fileName;
  } catch {
    return false;
  }
}

export default getFileName;