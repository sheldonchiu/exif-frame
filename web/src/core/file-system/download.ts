import { Media } from '@capacitor-community/media';
import { Capacitor } from '@capacitor/core';
import saveAs from 'file-saver';

/**
 * Download base64 data as a file.
 */
export default async function download(filename: string, data: string): Promise<void> {
  // Save the file based on the platform.
  switch (Capacitor.getPlatform()) {
    case 'ios':
      await Media.savePhoto({ fileName: filename, path: data });
      break;

    case 'android':
      if (!(await Media.getAlbums()).albums.map((album) => album.name).includes('EXIF Frame')) {
        await Media.createAlbum({ name: 'EXIF Frame' });
      }

      await Media.savePhoto({
        fileName: filename,
        path: data,
        albumIdentifier: (await Media.getAlbums()).albums.find((album) => album.name === 'EXIF Frame')?.identifier,
      });
      break;

    case 'web':
      saveAs(data, filename);
      break;
  }
}