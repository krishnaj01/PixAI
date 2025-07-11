import sharp from 'sharp';
import axios from 'axios';

export async function convertBase64ToCovered1024(base64Image) {
    // Remove base64 header if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');

    // Resize using "cover" to crop without quality loss
    const outputBuffer = await sharp(imgBuffer)
        .resize(1024, 1024, {
            fit: 'cover',
            position: 'centre',
        })
        .toFormat('png')
        .toBuffer();

    return `data:image/png;base64,${outputBuffer.toString('base64')}`;
}

export async function convertUrlToCovered1024(imageUrl) {
    // Download image using axios as a stream
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imgBuffer = Buffer.from(response.data, 'binary');

    // Resize using "cover" to crop without quality loss
    const outputBuffer = await sharp(imgBuffer)
        .resize(1024, 1024, {
            fit: 'cover',
            position: 'centre',
        })
        .toFormat('png')
        .toBuffer();

    return `data:image/png;base64,${outputBuffer.toString('base64')}`;
}
